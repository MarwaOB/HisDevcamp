import pandas as pd
import numpy as np

def preprocess_train_data(data):
    data = data.copy()

    # Add missing fields
    data['year'] = 2025
    data['week_num'] = 1

    # Convert to datetime
    data['week_start'] = pd.to_datetime(
        data['year'].astype(str) + '-W' + data['week_num'].astype(str) + '-1',
        errors='coerce'
    )

    data['weekofyear'] = data['week_start'].dt.isocalendar().week
    data['week_sin'] = np.sin(2 * np.pi * data['weekofyear'] / 52)
    data['week_cos'] = np.cos(2 * np.pi * data['weekofyear'] / 52)
    data['discount'] = (data['base_price'] - data['total_price']) / data['base_price']
    data['discount'] = data['discount'].fillna(0)

    # One-hot encode categorical variables
    data = pd.get_dummies(data, columns=['store_id', 'sku_id'])

    # Select relevant features
    features = ['total_price', 'base_price', 'is_featured_sku', 'is_display_sku',
                'discount', 'week_sin', 'week_cos']
    features += [col for col in data.columns if col.startswith('store_id_') or col.startswith('sku_id_')]

    # Fill any remaining NaNs
    data = data.fillna(0)

    # Return as a DataFrame
    return data[features]