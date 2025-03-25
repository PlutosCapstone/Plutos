from dotenv import load_dotenv
import pandas as pd
import pickle
import os

import cohere


load_dotenv()


COHERE_API_KEY = os.environ.get("cohere_api_key")
COHERE_MODEL_ID = os.environ.get("cohere_model_id")

ENV = os.environ.get("env", "dev")
TEST_ENV = "test"


class Categorizer:
    def __init__(
        self,
        model_path: str = "model/model.pkl",
        vectorizer_path: str = "model/vectorizer.pkl",
        label_encoder_path: str = "model/label_encoder.pkl",
    ):
        base_path = os.path.dirname(os.path.abspath(__file__))

        with open(os.path.join(base_path, model_path), "rb") as f:
            self.model = pickle.load(f)

        with open(os.path.join(base_path, vectorizer_path), "rb") as f:
            self.vectorizer = pickle.load(f)

        with open(os.path.join(base_path, label_encoder_path), "rb") as f:
            self.label_encoder = pickle.load(f)

        if ENV == TEST_ENV:
            self.co = None
            self.model_id = None
        else:
            self.co = cohere.Client(COHERE_API_KEY)
            self.model_id = COHERE_MODEL_ID

    def categorize(self, items: pd.DataFrame) -> pd.DataFrame:
        if ENV == TEST_ENV:
            return self._local_categorize(items)

        response = self.co.classify(model=self.model_id, inputs=items["name"].tolist())
        predictions = response.classifications
        categories = [prediction.prediction for prediction in predictions]
        items["category"] = categories
        return items

    def _local_categorize(self, items: pd.DataFrame) -> pd.DataFrame:
        items_transformed = self.vectorizer.transform(items["name"])
        y_pred = self.model.predict(items_transformed)
        predicted_categories = self.label_encoder.inverse_transform(y_pred)

        items["category"] = predicted_categories
        return items
