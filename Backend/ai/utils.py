import numpy as np
import pandas as pd

def preprocess_data(data):
    # Convert 'week' column to datetime
    data['week'] = pd.to_datetime(data['week'], errors='coerce')

    # Extract week of year as integer
    data['weekofyear'] = data['week'].dt.isocalendar().week.astype(int)

    # 👉 Use weekofyear for sinusoidal transformation
    data['week_sin'] = np.sin(2 * np.pi * data['weekofyear'] / 52)
    data['week_cos'] = np.cos(2 * np.pi * data['weekofyear'] / 52)

    # Calculate discount
    data['discount'] = (data['base_price'] - data['total_price']) / data['base_price']
    data['discount'] = data['discount'].fillna(0)

    # One-hot encode categorical variables
    data = pd.get_dummies(data, columns=['store_id', 'sku_id'])

    # Define features
    features = [
        'total_price', 'base_price', 'is_featured_sku', 'is_display_sku',
        'discount', 'week_sin', 'week_cos'
    ]
    features += [col for col in data.columns if col.startswith('store_id_') or col.startswith('sku_id_')]

    return data[features].values
