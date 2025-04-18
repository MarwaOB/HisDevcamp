import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from collections import defaultdict
from django.core.cache import cache
import io
import base64
import pandas as pd
import os

def generate_critical_products_graph(user):
    dashboard_data = cache.get(f'dashboard_data_user_{user.id}')
    if not dashboard_data:
        raise ValueError("Aucune donnée de prédiction disponible.")

    demand_per_product = defaultdict(int)
    for entry in dashboard_data:
        demand_per_product[entry["product_id"]] += entry["units_sold"]

    top = sorted(demand_per_product.items(), key=lambda x: x[1], reverse=True)[:6]
    if not top:
        raise ValueError("Pas assez de données pour générer le graphique.")

    product_ids, values = zip(*top)
    
    # Convertir les IDs de produit en strings pour un meilleur affichage
    product_ids_str = [str(pid) for pid in product_ids]
    
    fig, ax = plt.subplots(figsize=(12, 8))  # Taille augmentée
    
    bars = ax.bar(product_ids_str, values)
    
    # Ajout des valeurs sur les barres
    for bar in bars:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height,
                f'{height:,}',
                ha='center', va='bottom')
    
    ax.set_title("Produits les plus critiques (forte demande)", fontsize=14, pad=20)
    ax.set_xlabel("Produit", fontsize=12)
    ax.set_ylabel("Demandes prédites", fontsize=12)
    
    # Formater l'axe Y pour les grands nombres
    ax.get_yaxis().set_major_formatter(
        plt.FuncFormatter(lambda x, p: format(int(x), ',')))
    
    # Rotation des étiquettes X si nécessaire
    plt.xticks(rotation=45, ha='right')
    
    plt.tight_layout()

    output_dir = 'media/graphs'
    os.makedirs(output_dir, exist_ok=True)
    filepath = os.path.join(output_dir, f'critical_products_user_{user.id}.png')
    plt.savefig(filepath, dpi=100)  # Ajout du paramètre DPI
    plt.close(fig)
    return filepath

def get_season_from_month(month):
    if month in [12, 1, 2]:
        return "Hiver"
    elif month in [3, 4, 5]:
        return "Printemps"
    elif month in [6, 7, 8]:
        return "Été"
    elif month in [9, 10, 11]:
        return "Automne"
def generate_seasonal_products_graph(user):
    dashboard_data = cache.get(f'dashboard_data_user_{user.id}')
    if not dashboard_data:
        raise ValueError("Aucune donnée de prédiction disponible.")

    output_dir = 'media/graphs'
    os.makedirs(output_dir, exist_ok=True)
    filepath = os.path.join(output_dir, f'seasonal_products_user_{user.id}.png')

    # Process data
    seasonal_demand = defaultdict(lambda: defaultdict(int))
    for entry in dashboard_data:
        date = pd.to_datetime(entry["date"])
        month = date.month
        season = get_season_from_month(month)
        seasonal_demand[season][entry["product_id"]] += entry["units_sold"]

    # Create plot
    n_seasons = len(seasonal_demand)
    if n_seasons == 0:
        # Create empty plot if no data
        fig, ax = plt.subplots(figsize=(8, 6))
        ax.text(0.5, 0.5, 'No seasonal data available', ha='center', va='center')
        plt.savefig(filepath, dpi=100)
        plt.close(fig)
        return filepath

    fig, axs = plt.subplots(1, n_seasons, figsize=(6 * n_seasons, 8))
    if n_seasons == 1:
        axs = [axs]

    for i, (season, products) in enumerate(seasonal_demand.items()):
        top = sorted(products.items(), key=lambda x: x[1], reverse=True)[:5]
        if not top:
            continue
            
        prod, values = zip(*top)
        prod_str = [str(p) for p in prod]  # Convert product IDs to strings
        
        bars = axs[i].bar(prod_str, values)
        
        # Add value labels on bars
        for bar in bars:
            height = bar.get_height()
            axs[i].text(bar.get_x() + bar.get_width()/2., height,
                       f'{int(height):,}',
                       ha='center', va='bottom')
        
        axs[i].set_title(f"{season}")
        axs[i].set_ylabel("Demandes prédites")
        axs[i].set_xlabel("Produit")
        axs[i].tick_params(axis='x', rotation=45)

    plt.tight_layout()
    plt.savefig(filepath, dpi=100, bbox_inches='tight')
    plt.close(fig)

    return filepath

def generate_product_status_graph(user):
    dashboard_data = cache.get(f'dashboard_data_user_{user.id}')
    if not dashboard_data:
        raise ValueError("Aucune donnée de prédiction disponible.")

    output_dir = 'media/graphs'
    os.makedirs(output_dir, exist_ok=True)
    filepath = os.path.join(output_dir, f'product_status_user_{user.id}.png')

    # Calculate statistics
    featured_count = sum(1 for entry in dashboard_data if entry["is_featured"])
    non_featured_count = len(dashboard_data) - featured_count
    
    display_count = sum(1 for entry in dashboard_data if entry["is_display_sku"])
    non_display_count = len(dashboard_data) - display_count

    # Create figure with two subplots
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 6))
    
    # Featured products pie chart
    if featured_count + non_featured_count > 0:
        ax1.pie([featured_count, non_featured_count],
                labels=['En vedette', 'Non vedette'],
                autopct='%1.1f%%',
                colors=['#ff9999','#66b3ff'],
                startangle=90)
        ax1.set_title('Produits en vedette')
    else:
        ax1.text(0.5, 0.5, 'No featured product data', 
                ha='center', va='center')
    
    # Display products pie chart
    if display_count + non_display_count > 0:
        ax2.pie([display_count, non_display_count],
                labels=['En display', 'Non display'],
                autopct='%1.1f%%',
                colors=['#99ff99','#ffcc99'],
                startangle=90)
        ax2.set_title('Produits en display')
    else:
        ax2.text(0.5, 0.5, 'No display product data', 
                ha='center', va='center')
    
    fig.suptitle('Statut des produits', fontsize=16)
    plt.tight_layout()
    plt.savefig(filepath, dpi=100, bbox_inches='tight')
    plt.close(fig)

    return filepath

