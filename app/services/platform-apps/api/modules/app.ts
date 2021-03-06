import { Module, EApiPermissions, apiMethod, IApiContext } from './module';
import { PlatformAppsService } from 'services/platform-apps';
import { Inject } from 'util/injector';
import { NavigationService } from 'services/navigation';

interface INavigation {
  sourceId?: string;
}

type TNavigationCallback = (nav: INavigation) => void;

export class AppModule extends Module {

  readonly moduleName = 'App';
  readonly permissions: EApiPermissions[] = [];

  @Inject() navigationService: NavigationService;

  callbacks: Dictionary<TNavigationCallback> = {};

  constructor() {
    super();
    this.navigationService.navigated.subscribe(nav => {
      if (nav.currentPage === 'PlatformAppContainer') {
        if (this.callbacks[nav.params.appId]) {
          const data: INavigation = {};

          if (nav.params.sourceId) data.sourceId = nav.params.sourceId;

          this.callbacks[nav.params.appId](data);
        }
      }
    });
  }

  @apiMethod()
  onNavigation(ctx: IApiContext, cb: TNavigationCallback) {
    this.callbacks[ctx.app.id] = cb;
  }

}
