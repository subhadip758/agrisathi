import logging
from routes import all_blueprints        

logger = logging.getLogger(__name__)


def register_routes(app):
    """
    Register all feature Blueprints with the Flask application instance.

    Parameters
    ----------
    app : flask.Flask
        The application created in app.py / create_app().
    """
    for bp in all_blueprints:
        app.register_blueprint(bp)
        logger.info(f"Registered blueprint: {bp.name!r}")

    logger.info(
        f"All {len(all_blueprints)} route blueprint(s) registered successfully. "
        f"Endpoints: "
        f"POST /api/crop-recommendation, "
        f"POST /api/soil-analysis, "
        f"POST /api/predict-price, "
        f"POST /api/yield-prediction, "
        f"POST /api/fertilizer-recommendation, "
        f"GET  /api/fertilizer/crops, "
        f"GET  /api/fertilizer/stages, "
        f"POST /api/irrigation/predict, "
        f"POST /api/irrigation/schedule-recommendation, "
        f"GET  /api/models/<model_type>/info"
    )