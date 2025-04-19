import numpy as np
import pandas as pd

def preprocess_data(data):
    data = data.copy()

    # Construct datetime from year and week number (ISO format expects '-Wxx-1' for Monday)
    data['week_start'] = pd.to_datetime(
        data['year'].astype(str) + '-W' + data['week_num'].astype(str) + '-1',
        errors='coerce'
    )

    # Skip week_start entirely
    data['weekofyear'] = data['week_num']

    # Sinusoidal encoding
    data['week_sin'] = np.sin(2 * np.pi * data['weekofyear'] / 52)
    data['week_cos'] = np.cos(2 * np.pi * data['weekofyear'] / 52)

    # Discount calculation
    data['discount'] = (data['base_price'] - data['total_price']) / data['base_price']
    data['discount'] = data['discount'].fillna(0)

    # One-hot encode categorical variables
    data = pd.get_dummies(data, columns=['store_id', 'sku_id'])

    # Feature selection
    features = [
        'total_price', 'base_price', 'is_featured_sku', 'is_display_sku',
        'discount', 'week_sin', 'week_cos'
    ]
    features += [col for col in data.columns if col.startswith('store_id_') or col.startswith('sku_id_')]

    return data[features].values

def preprocess_test_data(data):
    # Preprocessing logic for test data (with missing 'year' and 'week_num')
    data = data.copy()

    # If the 'year' and 'week_num' columns are missing, you can create them manually or set defaults
    data['year'] = 2025  # Assume a default year, or change it accordingly
    data['week_num'] = 1  # You can set a default week number

    # Construct datetime from year and week number
    data['week_start'] = pd.to_datetime(
        data['year'].astype(str) + '-W' + data['week_num'].astype(str) + '-1',
        errors='coerce'
    )

    # Extract weekofyear
    data['weekofyear'] = data['week_start'].dt.isocalendar().week

    # Sinusoidal encoding for week
    data['week_sin'] = np.sin(2 * np.pi * data['weekofyear'] / 52)
    data['week_cos'] = np.cos(2 * np.pi * data['weekofyear'] / 52)

    # Calculate discount
    data['discount'] = (data['base_price'] - data['total_price']) / data['base_price']
    data['discount'] = data['discount'].fillna(0)

    # One-hot encode categorical variables
    data = pd.get_dummies(data, columns=['store_id', 'sku_id'])

    # Define features for test data
    features = ['total_price', 'base_price', 'is_featured_sku', 'is_display_sku', 'discount', 'week_sin', 'week_cos']
    features += [col for col in data.columns if col.startswith('store_id_') or col.startswith('sku_id_')]

    return data[features].values