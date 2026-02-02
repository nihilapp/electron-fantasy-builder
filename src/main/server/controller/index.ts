import { Hono } from 'hono';

import { AbilityController } from './AbilityController';
import { CharAbilityMapController } from './CharAbilityMapController';
import { CharacterController } from './CharacterController';
import { CharTraitMapController } from './CharTraitMapController';
import { CoreRuleController } from './CoreRuleController';
import { CreatureAbilityMapController } from './CreatureAbilityMapController';
import { CreatureController } from './CreatureController';
import { CreatureTraitMapController } from './CreatureTraitMapController';
import { EventController } from './EventController';
import { HealthController } from './HealthController';
import { HomeController } from './HomeController';
import { ItemController } from './ItemController';
import { LoreController } from './LoreController';
import { NationController } from './NationController';
import { OrganizationController } from './OrganizationController';
import { ProjectAbilityController } from './ProjectAbilityController';
import { ProjectController } from './ProjectController';
import { ProjectTraitController } from './ProjectTraitController';
import { RegionController } from './RegionController';
import { SearchController } from './SearchController';
import { TraitController } from './TraitController';

/**
 * 모든 컨트롤러를 하나의 Hono 앱으로 묶어 반환합니다.
 * 설정 엔티티는 개별 엔티티 접두어(/project-traits, /core-rules 등), prjNo는 쿼리/바디로 전달.
 */
export function createControllerApp(): Hono {
  const app = new Hono();

  app.route('/', HomeController);
  app.route('/health', HealthController);
  app.route('/projects', ProjectController);
  app.route('/traits', TraitController);
  app.route('/abilities', AbilityController);
  app.route('/project-traits', ProjectTraitController);
  app.route('/project-abilities', ProjectAbilityController);
  app.route('/search', SearchController);
  app.route('/core-rules', CoreRuleController);
  app.route('/creatures', CreatureController);
  app.route('/characters', CharacterController);
  app.route('/items', ItemController);
  app.route('/regions', RegionController);
  app.route('/nations', NationController);
  app.route('/organizations', OrganizationController);
  app.route('/events', EventController);
  app.route('/lores', LoreController);
  app.route('/char-trait-maps', CharTraitMapController);
  app.route('/char-ability-maps', CharAbilityMapController);
  app.route('/creature-trait-maps', CreatureTraitMapController);
  app.route('/creature-ability-maps', CreatureAbilityMapController);

  return app;
}
