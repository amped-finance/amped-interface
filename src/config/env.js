import { PRODUCTION_ENVIRONMENTS } from "./environments/production";
import { STAGE_ENVIRONMENTS } from "./environments/stage";

export const APP_ENVIRONMENTS = process.env.REACT_APP_IS_PRODUCTION ? PRODUCTION_ENVIRONMENTS : STAGE_ENVIRONMENTS;
