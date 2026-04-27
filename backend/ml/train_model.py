import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import os

def train_and_save_model():
    print("Loading real PCOS dataset from Kaggle...")
    
    csv_path = os.path.join(os.path.dirname(__file__), 'PCOS_data.csv')
    df = pd.read_csv(csv_path)
    
    # Clean up column names by stripping trailing spaces
    df.columns = df.columns.str.strip()
    
    # We select the features that our frontend can collect from the user
    feature_cols = [
        'Age (yrs)', 
        'BMI', 
        'Cycle length(days)', 
        'Weight gain(Y/N)', 
        'hair growth(Y/N)', 
        'Skin darkening (Y/N)', 
        'Hair loss(Y/N)', 
        'Pimples(Y/N)'
    ]
    target_col = 'PCOS (Y/N)'
    
    # Ensure all target columns exist (handle minor typos if necessary)
    # The dataset has 'Age (yrs)' with a leading space: ' Age (yrs)' so we just stripped it.
    
    # Drop any rows with NaN in these columns
    df = df.dropna(subset=feature_cols + [target_col])
    
    # Convert 'Cycle length(days)' to numeric as it might contain errors, coerce errors to NaN and drop
    df['Cycle length(days)'] = pd.to_numeric(df['Cycle length(days)'], errors='coerce')
    df = df.dropna(subset=['Cycle length(days)'])
    
    X = df[feature_cols]
    y = df[target_col]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    accuracy = model.score(X_test, y_test)
    print(f"Model trained successfully. Accuracy on test set: {accuracy * 100:.2f}%")
    
    # Save the model
    model_path = os.path.join(os.path.dirname(__file__), 'pcos_model.joblib')
    joblib.dump(model, model_path)
    print(f"Model saved to {model_path}")

if __name__ == "__main__":
    train_and_save_model()

