# 🚀 StockFlow – AI-Powered Demand Forecasting Platform

An intelligent demand forecasting platform designed for Algerian wholesalers, built during the **DEVCAMP 3.0 Hackathon**. StockFlow leverages machine learning to predict seasonal demand patterns and prevent stock shortages.

## 🎯 Project Overview

StockFlow helps wholesalers optimize their inventory management by providing accurate demand predictions using advanced machine learning algorithms. The platform analyzes historical sales data, seasonal trends, and promotional impacts to deliver actionable insights.

## ✨ Key Features

### 🤖 AI-Powered Predictions
- **XGBoost Algorithm** - Advanced machine learning for accurate demand forecasting
- **Seasonal Analysis** - Identifies and predicts seasonal demand patterns
- **Promotional Impact** - Analyzes the effect of promotions on sales
- **Real-time Analytics** - Live dashboard with up-to-date predictions

### 📊 Data Management
- **CSV Import** - Easy bulk data import functionality
- **Data Preprocessing** - Automated data cleaning and preparation
- **Feature Engineering** - Advanced feature creation for better predictions
- **Hyperparameter Tuning** - Optimized ML models via RandomizedSearchCV

### 💼 Business Features
- **Multi-tier Subscriptions** - Flexible pricing plans for different business sizes
- **Interactive Dashboards** - Visual trend analysis and forecasting charts
- **Stock Alerts** - Automated notifications for potential stock shortages
- **Historical Analysis** - Comprehensive sales history insights

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern component-based UI framework
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Axios** - HTTP client for API communication

### Backend
- **Django** - Python web framework
- **Django REST Framework** - API development
- **PostgreSQL** - Robust relational database

### Machine Learning
- **XGBoost** - Gradient boosting algorithm
- **Scikit-learn** - ML preprocessing and model evaluation
- **Pandas & NumPy** - Data manipulation and analysis
- **RandomizedSearchCV** - Hyperparameter optimization

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- PostgreSQL 12+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/stockflow.git
   cd stockflow
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Database Configuration**
   ```bash
   # Create PostgreSQL database
   createdb stockflow_db
   
   # Run migrations
   python manage.py migrate
   
   # Create superuser
   python manage.py createsuperuser
   ```

4. **Environment Variables**
   
   Create a `.env` file in the backend directory:
   ```env
   DEBUG=True
   SECRET_KEY=your-secret-key
   DATABASE_URL=postgresql://user:password@localhost:5432/stockflow_db
   REDIS_URL=redis://localhost:6379/0
   JWT_SECRET=your-jwt-secret
   ```

5. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

6. **Start Backend Services**
   ```bash
   cd ../backend
   python manage.py runserver
   
   # In another terminal, start Celery worker
   celery -A stockflow worker --loglevel=info
   ```

### 🌐 Access the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Admin Panel**: [http://localhost:8000/admin](http://localhost:8000/admin)


## 🤖 Machine Learning Pipeline

### Data Processing
1. **Data Cleaning** - Remove duplicates, handle missing values
2. **Feature Engineering** - Create time-based features, lag variables
3. **Seasonal Decomposition** - Extract trend and seasonal components
4. **Normalization** - Scale features for optimal model performance

### Model Training
1. **XGBoost Configuration** - Optimized hyperparameters
2. **Cross-validation** - Ensure model robustness
3. **Feature Importance** - Identify key prediction factors
4. **Model Validation** - Performance metrics and evaluation

## 📊 Features Showcase

### 📈 Demand Forecasting
- Predict future demand with 85%+ accuracy
- Identify seasonal patterns and trends


## 🏆 Hackathon Achievement

**DEVCAMP 3.0 Hackathon Project**
- Developed in 3 days during the hackathon
- Focused on solving real problems for Algerian wholesalers
- MVP delivered with core functionality and subscription model
- Demonstrated scalable architecture and ML integration

## 🔮 Future Enhancements

- **Mobile App** - React Native mobile application
- **Advanced ML Models** - LSTM, Prophet for time series forecasting
- **Multi-language Support** - Arabic and French localization
- **Advanced Analytics** - Predictive analytics for pricing optimization

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **DEVCAMP 3.0** - For providing the platform and inspiration
- **Algerian Wholesale Community** - For problem insights and feedback
- **Open Source Contributors** - For the amazing tools and libraries

---

⭐ **If you found this project helpful, please give it a star!** ⭐

*Built with ❤️ during DEVCAMP 3.0 Hackathon*
