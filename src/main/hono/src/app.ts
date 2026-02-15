import { Hono } from 'hono';
import { cors } from 'hono/cors';

import type { DbMode } from '@app-types/db.types';
import { runWithDbMode } from '@main/hono/src/common/db/context';

import { AbilityController } from './ability/AbilityController';
import { AuthController } from './auth/AuthController';
import { CharAbilityMapController } from './charAbilityMap/CharAbilityMapController';
import { CharacterController } from './character/CharacterController';
import { CharTraitMapController } from './charTraitMap/CharTraitMapController';
import { CoreRuleController } from './coreRule/CoreRuleController';
import { CreatureController } from './creature/CreatureController';
import { CreatureAbilityMapController } from './creatureAbilityMap/CreatureAbilityMapController';
import { CreatureTraitMapController } from './creatureTraitMap/CreatureTraitMapController';
import { EventController } from './event/EventController';
import { globalExceptionHandler } from './globalExceptionHandler';
import { HealthController } from './health/HealthController';
import { HomeController } from './home/HomeController';
import { ItemController } from './item/ItemController';
import { LoreController } from './lore/LoreController';
import { NationController } from './nation/NationController';
import { OrganizationController } from './organization/OrganizationController';
import { ProjectController } from './project/ProjectController';
import { ProjectAbilityController } from './projectAbility/ProjectAbilityController';
import { ProjectTraitController } from './projectTrait/ProjectTraitController';
import { RegionController } from './region/RegionController';
import { SearchController } from './search/SearchController';
import { SettingsSearchController } from './settingsSearch/SettingsSearchController';
import { TraitController } from './trait/TraitController';
import { UserController } from './user/UserController';

/**
 * 메인 프로세스 내부에서 동작하는 Hono 앱.
 * Controller → Service → DB(Mapper) 3계층 구조로 라우트가 구성됩니다.
 * 요청별 DB: X-Db-Target 헤더 또는 db 쿼리(remote | local)로 외부/로컬 DB 선택.
 */
const app = new Hono();

// 미처리 예외 → 표준 응답(ResponseType)으로 변환, HTTP 200 반환
app.onError(globalExceptionHandler);

// 렌더러(localhost:3000 등)에서 fetch 시 CORS 허용
app.use(
  '*',
  cors({
    origin: (origin) => origin || '*',
    allowMethods: [ 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', ],
    allowHeaders: [ 'Content-Type', 'Authorization', 'X-Db-Target', ],
    credentials: true,
  })
);

// 요청별 DB 타깃: X-Db-Target: remote | local 또는 ?db=remote | ?db=local (미지정 시 config.db.mode)
app.use('*', async (context, next) => {
  const raw = context.req.header('X-Db-Target') ?? context.req.query('db');

  let mode: DbMode | undefined;
  if (raw === 'remote') mode = 'remote';
  else if (raw === 'local') mode = 'local';

  return runWithDbMode(mode, next);
});

// 컨트롤러 라우팅
app.route('/', HomeController);
app.route('/abilities', AbilityController);
app.route('/auth', AuthController);
app.route('/char-ability-maps', CharAbilityMapController);
app.route('/char-trait-maps', CharTraitMapController);
app.route('/characters', CharacterController);
app.route('/core-rules', CoreRuleController);
app.route('/creatures', CreatureController);
app.route('/creature-ability-maps', CreatureAbilityMapController);
app.route('/creature-trait-maps', CreatureTraitMapController);
app.route('/events', EventController);
app.route('/health', HealthController);
app.route('/items', ItemController);
app.route('/lores', LoreController);
app.route('/nations', NationController);
app.route('/organizations', OrganizationController);
app.route('/projects', ProjectController);
app.route('/project-abilities', ProjectAbilityController);
app.route('/project-traits', ProjectTraitController);
app.route('/regions', RegionController);
app.route('/search', SearchController);
app.route('/settings-search', SettingsSearchController);
app.route('/traits', TraitController);
app.route('/users', UserController);

export { app as honoApp };
