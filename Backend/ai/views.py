from django.shortcuts import render
# backend/ai_model/views.py

from django.http import JsonResponse
import pickle
import pandas as pd
from .utils import preprocess_data

# Load model once
model = pickle.load(open('backend/ai_model/model.pkl', 'rb'))

def predict(request):
    # Parse GET parameters
    data = {
        'week': float(request.GET.get('week', 0)),
        'store_id': int(request.GET.get('store_id', 0)),
        'sku_id': int(request.GET.get('sku_id', 0)),
        'total_price': float(request.GET.get('total_price', 0)),
        'base_price': float(request.GET.get('base_price', 0)),
        'is_featured_sku': int(request.GET.get('is_featured_sku', 0)),
        'is_display_sku': int(request.GET.get('is_display_sku', 0))
    }

    # Convert to DataFrame
    df = pd.DataFrame([data])
    
    # Preprocess input
    X = preprocess_data(df)
    
    # Predict
    y_pred = model.predict(X)
    
    return JsonResponse({'prediction': y_pred.tolist()})

