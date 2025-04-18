from flask import Blueprint, request, jsonify
from utils import fetch_stock_data

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/analytics', methods=['POST'])
def get_stock_data():
    data = request.get_json()

    if not data or 'tickers' not in data:
        return jsonify({'error': 'Please provide a list of stock tickers under the "tickers" key.'}), 400

    tickers = data['tickers']
    if not isinstance(tickers, list):
        return jsonify({'error': 'Tickers must be provided as a list.'}), 400

    results = {}
    for ticker in tickers:
        results[ticker] = fetch_stock_data(ticker)

    return jsonify(results)
