'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">Dinivas</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                        <li class="link">
                            <a href="contributing.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CONTRIBUTING
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AdminIamModule.html" data-type="entity-link">AdminIamModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AdminIamModule-5345122bd0e36e98a00f250b53bf158f"' : 'data-target="#xs-controllers-links-module-AdminIamModule-5345122bd0e36e98a00f250b53bf158f"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AdminIamModule-5345122bd0e36e98a00f250b53bf158f"' :
                                            'id="xs-controllers-links-module-AdminIamModule-5345122bd0e36e98a00f250b53bf158f"' }>
                                            <li class="link">
                                                <a href="controllers/AdminIamController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminIamController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AdminIamModule-5345122bd0e36e98a00f250b53bf158f"' : 'data-target="#xs-injectables-links-module-AdminIamModule-5345122bd0e36e98a00f250b53bf158f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AdminIamModule-5345122bd0e36e98a00f250b53bf158f"' :
                                        'id="xs-injectables-links-module-AdminIamModule-5345122bd0e36e98a00f250b53bf158f"' }>
                                        <li class="link">
                                            <a href="injectables/AdminIamService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AdminIamService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminIamModule.html" data-type="entity-link">AdminIamModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminIamModule-71c4df1ee2122c4eb2060785fc9d4592-1"' : 'data-target="#xs-components-links-module-AdminIamModule-71c4df1ee2122c4eb2060785fc9d4592-1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminIamModule-71c4df1ee2122c4eb2060785fc9d4592-1"' :
                                            'id="xs-components-links-module-AdminIamModule-71c4df1ee2122c4eb2060785fc9d4592-1"' }>
                                            <li class="link">
                                                <a href="components/AdminIAMMemberComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminIAMMemberComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AdminIamComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminIamComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminIamRoutingModule.html" data-type="entity-link">AdminIamRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AdminModule.html" data-type="entity-link">AdminModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminModule-fbcca6d1bfa945d0c99216ef31bcc541"' : 'data-target="#xs-components-links-module-AdminModule-fbcca6d1bfa945d0c99216ef31bcc541"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminModule-fbcca6d1bfa945d0c99216ef31bcc541"' :
                                            'id="xs-components-links-module-AdminModule-fbcca6d1bfa945d0c99216ef31bcc541"' }>
                                            <li class="link">
                                                <a href="components/AdminComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashboardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ServerInfoComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ServerInfoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ServerMonitorStatusComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ServerMonitorStatusComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminRoutingModule.html" data-type="entity-link">AdminRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AnsibleModule.html" data-type="entity-link">AnsibleModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AnsibleRoutingModule.html" data-type="entity-link">AnsibleRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-497fff03f40f2b38f31bd61281737d6a"' : 'data-target="#xs-controllers-links-module-AppModule-497fff03f40f2b38f31bd61281737d6a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-497fff03f40f2b38f31bd61281737d6a"' :
                                            'id="xs-controllers-links-module-AppModule-497fff03f40f2b38f31bd61281737d6a"' }>
                                            <li class="link">
                                                <a href="controllers/InfoController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">InfoController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-497fff03f40f2b38f31bd61281737d6a"' : 'data-target="#xs-injectables-links-module-AppModule-497fff03f40f2b38f31bd61281737d6a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-497fff03f40f2b38f31bd61281737d6a"' :
                                        'id="xs-injectables-links-module-AppModule-497fff03f40f2b38f31bd61281737d6a"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-4599018eff7861a16c28b16583d70f0c-1"' : 'data-target="#xs-components-links-module-AppModule-4599018eff7861a16c28b16583d70f0c-1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-4599018eff7861a16c28b16583d70f0c-1"' :
                                            'id="xs-components-links-module-AppModule-4599018eff7861a16c28b16583d70f0c-1"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfirmationDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConfirmationDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FooterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FooterComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-4599018eff7861a16c28b16583d70f0c-1"' : 'data-target="#xs-injectables-links-module-AppModule-4599018eff7861a16c28b16583d70f0c-1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-4599018eff7861a16c28b16583d70f0c-1"' :
                                        'id="xs-injectables-links-module-AppModule-4599018eff7861a16c28b16583d70f0c-1"' }>
                                        <li class="link">
                                            <a href="injectables/ApiInfoService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ApiInfoService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CloudproviderService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CloudproviderService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-c564314ded5372144d7c5a865250cdda-2"' : 'data-target="#xs-controllers-links-module-AppModule-c564314ded5372144d7c5a865250cdda-2"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-c564314ded5372144d7c5a865250cdda-2"' :
                                            'id="xs-controllers-links-module-AppModule-c564314ded5372144d7c5a865250cdda-2"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-c564314ded5372144d7c5a865250cdda-2"' : 'data-target="#xs-injectables-links-module-AppModule-c564314ded5372144d7c5a865250cdda-2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-c564314ded5372144d7c5a865250cdda-2"' :
                                        'id="xs-injectables-links-module-AppModule-c564314ded5372144d7c5a865250cdda-2"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link">AuthModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/BuildModule.html" data-type="entity-link">BuildModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/BuildModule.html" data-type="entity-link">BuildModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/BuildRoutingModule.html" data-type="entity-link">BuildRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CloudproviderModule.html" data-type="entity-link">CloudproviderModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-CloudproviderModule-e02e6202c9da73aa52bcfe40c7e61139"' : 'data-target="#xs-controllers-links-module-CloudproviderModule-e02e6202c9da73aa52bcfe40c7e61139"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CloudproviderModule-e02e6202c9da73aa52bcfe40c7e61139"' :
                                            'id="xs-controllers-links-module-CloudproviderModule-e02e6202c9da73aa52bcfe40c7e61139"' }>
                                            <li class="link">
                                                <a href="controllers/CloudproviderController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CloudproviderController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CloudproviderModule-e02e6202c9da73aa52bcfe40c7e61139"' : 'data-target="#xs-injectables-links-module-CloudproviderModule-e02e6202c9da73aa52bcfe40c7e61139"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CloudproviderModule-e02e6202c9da73aa52bcfe40c7e61139"' :
                                        'id="xs-injectables-links-module-CloudproviderModule-e02e6202c9da73aa52bcfe40c7e61139"' }>
                                        <li class="link">
                                            <a href="injectables/CloudproviderService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CloudproviderService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CloudproviderRoutingModule.html" data-type="entity-link">CloudproviderRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CloudprovidersModule.html" data-type="entity-link">CloudprovidersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-CloudprovidersModule-5f353750e3eebfa9443fec3089ab1207"' : 'data-target="#xs-components-links-module-CloudprovidersModule-5f353750e3eebfa9443fec3089ab1207"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CloudprovidersModule-5f353750e3eebfa9443fec3089ab1207"' :
                                            'id="xs-components-links-module-CloudprovidersModule-5f353750e3eebfa9443fec3089ab1207"' }>
                                            <li class="link">
                                                <a href="components/CloudproviderEditComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CloudproviderEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CloudprovidersComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CloudprovidersComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ClusterModule.html" data-type="entity-link">ClusterModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ClusterRoutingModule.html" data-type="entity-link">ClusterRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CommonUiModule.html" data-type="entity-link">CommonUiModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ComputeModule.html" data-type="entity-link">ComputeModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ComputeModule.html" data-type="entity-link">ComputeModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ComputeRoutingModule.html" data-type="entity-link">ComputeRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ConsulModule.html" data-type="entity-link">ConsulModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ConsulModule-b0c5ef3695437ddbab5332e843a1026f"' : 'data-target="#xs-controllers-links-module-ConsulModule-b0c5ef3695437ddbab5332e843a1026f"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ConsulModule-b0c5ef3695437ddbab5332e843a1026f"' :
                                            'id="xs-controllers-links-module-ConsulModule-b0c5ef3695437ddbab5332e843a1026f"' }>
                                            <li class="link">
                                                <a href="controllers/ConsulController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConsulController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ConsulModule-b0c5ef3695437ddbab5332e843a1026f"' : 'data-target="#xs-injectables-links-module-ConsulModule-b0c5ef3695437ddbab5332e843a1026f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ConsulModule-b0c5ef3695437ddbab5332e843a1026f"' :
                                        'id="xs-injectables-links-module-ConsulModule-b0c5ef3695437ddbab5332e843a1026f"' }>
                                        <li class="link">
                                            <a href="injectables/ConsulService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ConsulService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ConsulModule.html" data-type="entity-link">ConsulModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ConsulModule-8d89bb8ac46ec9f776562f353e67511f-1"' : 'data-target="#xs-components-links-module-ConsulModule-8d89bb8ac46ec9f776562f353e67511f-1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ConsulModule-8d89bb8ac46ec9f776562f353e67511f-1"' :
                                            'id="xs-components-links-module-ConsulModule-8d89bb8ac46ec9f776562f353e67511f-1"' }>
                                            <li class="link">
                                                <a href="components/ConsulComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConsulComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConsulStatusComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConsulStatusComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConsulViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConsulViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConsulWizardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConsulWizardComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ConsulRoutingModule.html" data-type="entity-link">ConsulRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CoreModule.html" data-type="entity-link">CoreModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CoreModule-c63846342dfeff7977bd08c36ac7194a"' : 'data-target="#xs-injectables-links-module-CoreModule-c63846342dfeff7977bd08c36ac7194a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CoreModule-c63846342dfeff7977bd08c36ac7194a"' :
                                        'id="xs-injectables-links-module-CoreModule-c63846342dfeff7977bd08c36ac7194a"' }>
                                        <li class="link">
                                            <a href="injectables/CloudApiFactory.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CloudApiFactory</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ConfigService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ConfigService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GitService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>GitService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/KeycloakAdmin.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>KeycloakAdmin</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/OpenstackApiService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>OpenstackApiService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CoreModule.html" data-type="entity-link">CoreModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-CoreModule-9b23bb3ec506b76772d1b48ce8545302-1"' : 'data-target="#xs-components-links-module-CoreModule-9b23bb3ec506b76772d1b48ce8545302-1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CoreModule-9b23bb3ec506b76772d1b48ce8545302-1"' :
                                            'id="xs-components-links-module-CoreModule-9b23bb3ec506b76772d1b48ce8545302-1"' }>
                                            <li class="link">
                                                <a href="components/AdminIAMMemberEditComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminIAMMemberEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ArchitectureTypeRadiosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ArchitectureTypeRadiosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CloudFlavorRadiosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CloudFlavorRadiosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CloudImageRadiosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CloudImageRadiosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfirmDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConfirmDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FilterBarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FilterBarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FilterCriterionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FilterCriterionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NeedYourContributionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NeedYourContributionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SelectProjectDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SelectProjectDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SnackAlertDangerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SnackAlertDangerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SnackAlertSuccessComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SnackAlertSuccessComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SnackAlertWarningComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SnackAlertWarningComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CoreModule-9b23bb3ec506b76772d1b48ce8545302-1"' : 'data-target="#xs-injectables-links-module-CoreModule-9b23bb3ec506b76772d1b48ce8545302-1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CoreModule-9b23bb3ec506b76772d1b48ce8545302-1"' :
                                        'id="xs-injectables-links-module-CoreModule-9b23bb3ec506b76772d1b48ce8545302-1"' }>
                                        <li class="link">
                                            <a href="injectables/AlertService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AlertService</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-CoreModule-9b23bb3ec506b76772d1b48ce8545302-1"' : 'data-target="#xs-pipes-links-module-CoreModule-9b23bb3ec506b76772d1b48ce8545302-1"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-CoreModule-9b23bb3ec506b76772d1b48ce8545302-1"' :
                                            'id="xs-pipes-links-module-CoreModule-9b23bb3ec506b76772d1b48ce8545302-1"' }>
                                            <li class="link">
                                                <a href="pipes/FilterByPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FilterByPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/JsonPrettyPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">JsonPrettyPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/SafePipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafePipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/SelectedFilterPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SelectedFilterPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/TimeAgoPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TimeAgoPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/DashboardModule.html" data-type="entity-link">DashboardModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/DashboardRoutingModule.html" data-type="entity-link">DashboardRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/DisksModule.html" data-type="entity-link">DisksModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-DisksModule-3332d71a48dfc5ad55612fedbbf37d2c"' : 'data-target="#xs-controllers-links-module-DisksModule-3332d71a48dfc5ad55612fedbbf37d2c"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-DisksModule-3332d71a48dfc5ad55612fedbbf37d2c"' :
                                            'id="xs-controllers-links-module-DisksModule-3332d71a48dfc5ad55612fedbbf37d2c"' }>
                                            <li class="link">
                                                <a href="controllers/DisksController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DisksController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-DisksModule-3332d71a48dfc5ad55612fedbbf37d2c"' : 'data-target="#xs-injectables-links-module-DisksModule-3332d71a48dfc5ad55612fedbbf37d2c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-DisksModule-3332d71a48dfc5ad55612fedbbf37d2c"' :
                                        'id="xs-injectables-links-module-DisksModule-3332d71a48dfc5ad55612fedbbf37d2c"' }>
                                        <li class="link">
                                            <a href="injectables/DisksService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>DisksService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DisksModule.html" data-type="entity-link">DisksModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-DisksModule-d6b75b713bdda68668cea7cf13e33390-1"' : 'data-target="#xs-components-links-module-DisksModule-d6b75b713bdda68668cea7cf13e33390-1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-DisksModule-d6b75b713bdda68668cea7cf13e33390-1"' :
                                            'id="xs-components-links-module-DisksModule-d6b75b713bdda68668cea7cf13e33390-1"' }>
                                            <li class="link">
                                                <a href="components/DisksComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DisksComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/DisksRoutingModule.html" data-type="entity-link">DisksRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/DockerswarmModule.html" data-type="entity-link">DockerswarmModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-DockerswarmModule-befb8955d6871129f6ad65c0234cf445"' : 'data-target="#xs-components-links-module-DockerswarmModule-befb8955d6871129f6ad65c0234cf445"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-DockerswarmModule-befb8955d6871129f6ad65c0234cf445"' :
                                            'id="xs-components-links-module-DockerswarmModule-befb8955d6871129f6ad65c0234cf445"' }>
                                            <li class="link">
                                                <a href="components/DockerswarmComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DockerswarmComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/DockerswarmRoutingModule.html" data-type="entity-link">DockerswarmRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/DroneciModule.html" data-type="entity-link">DroneciModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-DroneciModule-caa2e14c74b5e6bf5087553c6c13fff2"' : 'data-target="#xs-controllers-links-module-DroneciModule-caa2e14c74b5e6bf5087553c6c13fff2"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-DroneciModule-caa2e14c74b5e6bf5087553c6c13fff2"' :
                                            'id="xs-controllers-links-module-DroneciModule-caa2e14c74b5e6bf5087553c6c13fff2"' }>
                                            <li class="link">
                                                <a href="controllers/DroneciController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DroneciController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-DroneciModule-caa2e14c74b5e6bf5087553c6c13fff2"' : 'data-target="#xs-injectables-links-module-DroneciModule-caa2e14c74b5e6bf5087553c6c13fff2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-DroneciModule-caa2e14c74b5e6bf5087553c6c13fff2"' :
                                        'id="xs-injectables-links-module-DroneciModule-caa2e14c74b5e6bf5087553c6c13fff2"' }>
                                        <li class="link">
                                            <a href="injectables/DroneciService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>DroneciService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DroneciModule.html" data-type="entity-link">DroneciModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-DroneciModule-0deb9162bb470e82904cb01d4b5fc9f2-1"' : 'data-target="#xs-components-links-module-DroneciModule-0deb9162bb470e82904cb01d4b5fc9f2-1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-DroneciModule-0deb9162bb470e82904cb01d4b5fc9f2-1"' :
                                            'id="xs-components-links-module-DroneciModule-0deb9162bb470e82904cb01d4b5fc9f2-1"' }>
                                            <li class="link">
                                                <a href="components/DroneciComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DroneciComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/DroneciRoutingModule.html" data-type="entity-link">DroneciRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ElasticsearchModule.html" data-type="entity-link">ElasticsearchModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ElasticsearchModule-1413835bf664b8d7a1491251e21aabbd"' : 'data-target="#xs-components-links-module-ElasticsearchModule-1413835bf664b8d7a1491251e21aabbd"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ElasticsearchModule-1413835bf664b8d7a1491251e21aabbd"' :
                                            'id="xs-components-links-module-ElasticsearchModule-1413835bf664b8d7a1491251e21aabbd"' }>
                                            <li class="link">
                                                <a href="components/ElasticsearchComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ElasticsearchComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ElasticsearchRoutingModule.html" data-type="entity-link">ElasticsearchRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/FlavorsModule.html" data-type="entity-link">FlavorsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-FlavorsModule-38feda88ab4e092a80b681201fd6ab27"' : 'data-target="#xs-controllers-links-module-FlavorsModule-38feda88ab4e092a80b681201fd6ab27"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-FlavorsModule-38feda88ab4e092a80b681201fd6ab27"' :
                                            'id="xs-controllers-links-module-FlavorsModule-38feda88ab4e092a80b681201fd6ab27"' }>
                                            <li class="link">
                                                <a href="controllers/FlavorsController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FlavorsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-FlavorsModule-38feda88ab4e092a80b681201fd6ab27"' : 'data-target="#xs-injectables-links-module-FlavorsModule-38feda88ab4e092a80b681201fd6ab27"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-FlavorsModule-38feda88ab4e092a80b681201fd6ab27"' :
                                        'id="xs-injectables-links-module-FlavorsModule-38feda88ab4e092a80b681201fd6ab27"' }>
                                        <li class="link">
                                            <a href="injectables/FlavorsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>FlavorsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/GalaxyModule.html" data-type="entity-link">GalaxyModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-GalaxyModule-2247935b021933ed9125978ec0042c4a"' : 'data-target="#xs-components-links-module-GalaxyModule-2247935b021933ed9125978ec0042c4a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-GalaxyModule-2247935b021933ed9125978ec0042c4a"' :
                                            'id="xs-components-links-module-GalaxyModule-2247935b021933ed9125978ec0042c4a"' }>
                                            <li class="link">
                                                <a href="components/GalaxyComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GalaxyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MyContentComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MyContentComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MyImportComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MyImportComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MySettingsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MySettingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProvidersComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProvidersComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RepoContentDetailComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RepoContentDetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SearchComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SearchComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SelectNamespaceDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SelectNamespaceDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SelectRepoDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SelectRepoDialogComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/GalaxyRoutingModule.html" data-type="entity-link">GalaxyRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/GitlabModule.html" data-type="entity-link">GitlabModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-GitlabModule-b9167926b9cce9b68ddbe7b6cc0efa47"' : 'data-target="#xs-controllers-links-module-GitlabModule-b9167926b9cce9b68ddbe7b6cc0efa47"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-GitlabModule-b9167926b9cce9b68ddbe7b6cc0efa47"' :
                                            'id="xs-controllers-links-module-GitlabModule-b9167926b9cce9b68ddbe7b6cc0efa47"' }>
                                            <li class="link">
                                                <a href="controllers/GitlabController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GitlabController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-GitlabModule-b9167926b9cce9b68ddbe7b6cc0efa47"' : 'data-target="#xs-injectables-links-module-GitlabModule-b9167926b9cce9b68ddbe7b6cc0efa47"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-GitlabModule-b9167926b9cce9b68ddbe7b6cc0efa47"' :
                                        'id="xs-injectables-links-module-GitlabModule-b9167926b9cce9b68ddbe7b6cc0efa47"' }>
                                        <li class="link">
                                            <a href="injectables/GitlabService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>GitlabService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/GitlabModule.html" data-type="entity-link">GitlabModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-GitlabModule-fe0b28a7c7d51168e9634023cf7d975c-1"' : 'data-target="#xs-components-links-module-GitlabModule-fe0b28a7c7d51168e9634023cf7d975c-1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-GitlabModule-fe0b28a7c7d51168e9634023cf7d975c-1"' :
                                            'id="xs-components-links-module-GitlabModule-fe0b28a7c7d51168e9634023cf7d975c-1"' }>
                                            <li class="link">
                                                <a href="components/GitlabComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GitlabComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GitlabStatusComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GitlabStatusComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GitlabViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GitlabViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GitlabWizardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GitlabWizardComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/GitlabRoutingModule.html" data-type="entity-link">GitlabRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/HarborModule.html" data-type="entity-link">HarborModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HarborModule-26fd3eeb77f9432e8c24d058a048cd73"' : 'data-target="#xs-components-links-module-HarborModule-26fd3eeb77f9432e8c24d058a048cd73"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HarborModule-26fd3eeb77f9432e8c24d058a048cd73"' :
                                            'id="xs-components-links-module-HarborModule-26fd3eeb77f9432e8c24d058a048cd73"' }>
                                            <li class="link">
                                                <a href="components/HarborComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HarborComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HarborRoutingModule.html" data-type="entity-link">HarborRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/HistoryModule.html" data-type="entity-link">HistoryModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HistoryModule-66343af193db7d7c81eb4daba5feb00c"' : 'data-target="#xs-components-links-module-HistoryModule-66343af193db7d7c81eb4daba5feb00c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HistoryModule-66343af193db7d7c81eb4daba5feb00c"' :
                                            'id="xs-components-links-module-HistoryModule-66343af193db7d7c81eb4daba5feb00c"' }>
                                            <li class="link">
                                                <a href="components/HistoryComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HistoryComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HistoryRoutingModule.html" data-type="entity-link">HistoryRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/HomeModule.html" data-type="entity-link">HomeModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/HomeRoutingModule.html" data-type="entity-link">HomeRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/IamModule.html" data-type="entity-link">IamModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-IamModule-135045f6165cab93246272cda369bbf6"' : 'data-target="#xs-controllers-links-module-IamModule-135045f6165cab93246272cda369bbf6"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-IamModule-135045f6165cab93246272cda369bbf6"' :
                                            'id="xs-controllers-links-module-IamModule-135045f6165cab93246272cda369bbf6"' }>
                                            <li class="link">
                                                <a href="controllers/IamController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">IamController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-IamModule-135045f6165cab93246272cda369bbf6"' : 'data-target="#xs-injectables-links-module-IamModule-135045f6165cab93246272cda369bbf6"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-IamModule-135045f6165cab93246272cda369bbf6"' :
                                        'id="xs-injectables-links-module-IamModule-135045f6165cab93246272cda369bbf6"' }>
                                        <li class="link">
                                            <a href="injectables/IamService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>IamService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/IamModule.html" data-type="entity-link">IamModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-IamModule-c61d01acc799eb6e3b34098cd499ded0-1"' : 'data-target="#xs-components-links-module-IamModule-c61d01acc799eb6e3b34098cd499ded0-1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-IamModule-c61d01acc799eb6e3b34098cd499ded0-1"' :
                                            'id="xs-components-links-module-IamModule-c61d01acc799eb6e3b34098cd499ded0-1"' }>
                                            <li class="link">
                                                <a href="components/IamComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">IamComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MemberEditComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MemberEditComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MembersComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MembersComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/IamRoutingModule.html" data-type="entity-link">IamRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ImagesModule.html" data-type="entity-link">ImagesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ImagesModule-1a691fd524aafd0777ec500a4bc117a6"' : 'data-target="#xs-controllers-links-module-ImagesModule-1a691fd524aafd0777ec500a4bc117a6"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ImagesModule-1a691fd524aafd0777ec500a4bc117a6"' :
                                            'id="xs-controllers-links-module-ImagesModule-1a691fd524aafd0777ec500a4bc117a6"' }>
                                            <li class="link">
                                                <a href="controllers/ImagesController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ImagesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ImagesModule-1a691fd524aafd0777ec500a4bc117a6"' : 'data-target="#xs-injectables-links-module-ImagesModule-1a691fd524aafd0777ec500a4bc117a6"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ImagesModule-1a691fd524aafd0777ec500a4bc117a6"' :
                                        'id="xs-injectables-links-module-ImagesModule-1a691fd524aafd0777ec500a4bc117a6"' }>
                                        <li class="link">
                                            <a href="injectables/ImagesService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ImagesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ImagesModule.html" data-type="entity-link">ImagesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ImagesModule-e7e5e46395db28c14426703d91f41acb-1"' : 'data-target="#xs-components-links-module-ImagesModule-e7e5e46395db28c14426703d91f41acb-1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ImagesModule-e7e5e46395db28c14426703d91f41acb-1"' :
                                            'id="xs-components-links-module-ImagesModule-e7e5e46395db28c14426703d91f41acb-1"' }>
                                            <li class="link">
                                                <a href="components/ImageToBuildDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ImageToBuildDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ImagesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ImagesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ImagesRoutingModule.html" data-type="entity-link">ImagesRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/InstancesModule.html" data-type="entity-link">InstancesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-InstancesModule-ce1336a6deda242c29a30cc0701a0855"' : 'data-target="#xs-controllers-links-module-InstancesModule-ce1336a6deda242c29a30cc0701a0855"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-InstancesModule-ce1336a6deda242c29a30cc0701a0855"' :
                                            'id="xs-controllers-links-module-InstancesModule-ce1336a6deda242c29a30cc0701a0855"' }>
                                            <li class="link">
                                                <a href="controllers/InstancesController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">InstancesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-InstancesModule-ce1336a6deda242c29a30cc0701a0855"' : 'data-target="#xs-injectables-links-module-InstancesModule-ce1336a6deda242c29a30cc0701a0855"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-InstancesModule-ce1336a6deda242c29a30cc0701a0855"' :
                                        'id="xs-injectables-links-module-InstancesModule-ce1336a6deda242c29a30cc0701a0855"' }>
                                        <li class="link">
                                            <a href="injectables/InstancesService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>InstancesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/InstancesModule.html" data-type="entity-link">InstancesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-InstancesModule-05c18acb3382c87ebbc6c06e82c62c8e-1"' : 'data-target="#xs-components-links-module-InstancesModule-05c18acb3382c87ebbc6c06e82c62c8e-1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-InstancesModule-05c18acb3382c87ebbc6c06e82c62c8e-1"' :
                                            'id="xs-components-links-module-InstancesModule-05c18acb3382c87ebbc6c06e82c62c8e-1"' }>
                                            <li class="link">
                                                <a href="components/InstanceStatusComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">InstanceStatusComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InstanceViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">InstanceViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InstanceWizardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">InstanceWizardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InstancesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">InstancesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/InstancesRoutingModule.html" data-type="entity-link">InstancesRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/JenkinsModule.html" data-type="entity-link">JenkinsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-JenkinsModule-b24c3d1518414c573e95bcf57173c760"' : 'data-target="#xs-controllers-links-module-JenkinsModule-b24c3d1518414c573e95bcf57173c760"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-JenkinsModule-b24c3d1518414c573e95bcf57173c760"' :
                                            'id="xs-controllers-links-module-JenkinsModule-b24c3d1518414c573e95bcf57173c760"' }>
                                            <li class="link">
                                                <a href="controllers/JenkinsController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">JenkinsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-JenkinsModule-b24c3d1518414c573e95bcf57173c760"' : 'data-target="#xs-injectables-links-module-JenkinsModule-b24c3d1518414c573e95bcf57173c760"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-JenkinsModule-b24c3d1518414c573e95bcf57173c760"' :
                                        'id="xs-injectables-links-module-JenkinsModule-b24c3d1518414c573e95bcf57173c760"' }>
                                        <li class="link">
                                            <a href="injectables/JenkinsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>JenkinsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/JenkinsModule.html" data-type="entity-link">JenkinsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-JenkinsModule-b57160188e7f24fbb0ffc7b932511d58-1"' : 'data-target="#xs-components-links-module-JenkinsModule-b57160188e7f24fbb0ffc7b932511d58-1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-JenkinsModule-b57160188e7f24fbb0ffc7b932511d58-1"' :
                                            'id="xs-components-links-module-JenkinsModule-b57160188e7f24fbb0ffc7b932511d58-1"' }>
                                            <li class="link">
                                                <a href="components/JenkinsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">JenkinsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/JenkinsStatusComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">JenkinsStatusComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/JenkinsViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">JenkinsViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/JenkinsWizardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">JenkinsWizardComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/JenkinsRoutingModule.html" data-type="entity-link">JenkinsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/KafkaModule.html" data-type="entity-link">KafkaModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/KafkaModule.html" data-type="entity-link">KafkaModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-KafkaModule-f8ca5ee2c4e8d46d1b0d538b82ff18e7-1"' : 'data-target="#xs-components-links-module-KafkaModule-f8ca5ee2c4e8d46d1b0d538b82ff18e7-1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-KafkaModule-f8ca5ee2c4e8d46d1b0d538b82ff18e7-1"' :
                                            'id="xs-components-links-module-KafkaModule-f8ca5ee2c4e8d46d1b0d538b82ff18e7-1"' }>
                                            <li class="link">
                                                <a href="components/KafkaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">KafkaComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/KafkaRoutingModule.html" data-type="entity-link">KafkaRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/KubernetesModule.html" data-type="entity-link">KubernetesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-KubernetesModule-481b3b5cfe571874465a1e59c7e2dc73"' : 'data-target="#xs-components-links-module-KubernetesModule-481b3b5cfe571874465a1e59c7e2dc73"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-KubernetesModule-481b3b5cfe571874465a1e59c7e2dc73"' :
                                            'id="xs-components-links-module-KubernetesModule-481b3b5cfe571874465a1e59c7e2dc73"' }>
                                            <li class="link">
                                                <a href="components/KubernetesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">KubernetesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/KubernetesRoutingModule.html" data-type="entity-link">KubernetesRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/LoggingModule.html" data-type="entity-link">LoggingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/LoggingRoutingModule.html" data-type="entity-link">LoggingRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MaterialModule.html" data-type="entity-link">MaterialModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MessagingModule.html" data-type="entity-link">MessagingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MessagingModule.html" data-type="entity-link">MessagingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MessagingRoutingModule.html" data-type="entity-link">MessagingRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MinioModule.html" data-type="entity-link">MinioModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-MinioModule-7b153da67b7d98230578e85a8d93e72b"' : 'data-target="#xs-components-links-module-MinioModule-7b153da67b7d98230578e85a8d93e72b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MinioModule-7b153da67b7d98230578e85a8d93e72b"' :
                                            'id="xs-components-links-module-MinioModule-7b153da67b7d98230578e85a8d93e72b"' }>
                                            <li class="link">
                                                <a href="components/MinioComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MinioComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MinioRoutingModule.html" data-type="entity-link">MinioRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MongodbModule.html" data-type="entity-link">MongodbModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-MongodbModule-de169c123b9c74414477aa3f2ae4d7cc"' : 'data-target="#xs-components-links-module-MongodbModule-de169c123b9c74414477aa3f2ae4d7cc"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MongodbModule-de169c123b9c74414477aa3f2ae4d7cc"' :
                                            'id="xs-components-links-module-MongodbModule-de169c123b9c74414477aa3f2ae4d7cc"' }>
                                            <li class="link">
                                                <a href="components/MongodbComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MongodbComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MongodbRoutingModule.html" data-type="entity-link">MongodbRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MonitoringModule.html" data-type="entity-link">MonitoringModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MonitoringRoutingModule.html" data-type="entity-link">MonitoringRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MqttModule.html" data-type="entity-link">MqttModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-MqttModule-d677a082c50ccb4f6f8ce9cafe4e5001"' : 'data-target="#xs-components-links-module-MqttModule-d677a082c50ccb4f6f8ce9cafe4e5001"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MqttModule-d677a082c50ccb4f6f8ce9cafe4e5001"' :
                                            'id="xs-components-links-module-MqttModule-d677a082c50ccb4f6f8ce9cafe4e5001"' }>
                                            <li class="link">
                                                <a href="components/MqttComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MqttComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MqttRoutingModule.html" data-type="entity-link">MqttRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/NetworkModule.html" data-type="entity-link">NetworkModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/NetworkModule.html" data-type="entity-link">NetworkModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/NetworkRoutingModule.html" data-type="entity-link">NetworkRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/NexusModule.html" data-type="entity-link">NexusModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/NexusRoutingModule.html" data-type="entity-link">NexusRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/OpenshiftModule.html" data-type="entity-link">OpenshiftModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-OpenshiftModule-63d1d3bb1388a8d9315df1d88a4a84c7"' : 'data-target="#xs-components-links-module-OpenshiftModule-63d1d3bb1388a8d9315df1d88a4a84c7"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-OpenshiftModule-63d1d3bb1388a8d9315df1d88a4a84c7"' :
                                            'id="xs-components-links-module-OpenshiftModule-63d1d3bb1388a8d9315df1d88a4a84c7"' }>
                                            <li class="link">
                                                <a href="components/OpenshiftComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">OpenshiftComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/OpenshiftRoutingModule.html" data-type="entity-link">OpenshiftRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PostgresqlModule.html" data-type="entity-link">PostgresqlModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-PostgresqlModule-975ec1d5631ef459b4599f4a92c3f12e"' : 'data-target="#xs-components-links-module-PostgresqlModule-975ec1d5631ef459b4599f4a92c3f12e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-PostgresqlModule-975ec1d5631ef459b4599f4a92c3f12e"' :
                                            'id="xs-components-links-module-PostgresqlModule-975ec1d5631ef459b4599f4a92c3f12e"' }>
                                            <li class="link">
                                                <a href="components/PostgresqlComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PostgresqlComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PostgresqlStatusComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PostgresqlStatusComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PostgresqlViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PostgresqlViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PostgresqlWizardVarsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PostgresqlWizardVarsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/PostgresqlRoutingModule.html" data-type="entity-link">PostgresqlRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ProjectsModule.html" data-type="entity-link">ProjectsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ProjectsModule-157aa9f6ab6397895357f3bfc7a326fb"' : 'data-target="#xs-controllers-links-module-ProjectsModule-157aa9f6ab6397895357f3bfc7a326fb"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProjectsModule-157aa9f6ab6397895357f3bfc7a326fb"' :
                                            'id="xs-controllers-links-module-ProjectsModule-157aa9f6ab6397895357f3bfc7a326fb"' }>
                                            <li class="link">
                                                <a href="controllers/ProjectsController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProjectsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ProjectsModule-157aa9f6ab6397895357f3bfc7a326fb"' : 'data-target="#xs-injectables-links-module-ProjectsModule-157aa9f6ab6397895357f3bfc7a326fb"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProjectsModule-157aa9f6ab6397895357f3bfc7a326fb"' :
                                        'id="xs-injectables-links-module-ProjectsModule-157aa9f6ab6397895357f3bfc7a326fb"' }>
                                        <li class="link">
                                            <a href="injectables/ProjectsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ProjectsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProjectsModule.html" data-type="entity-link">ProjectsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ProjectsModule-9b22a52446ec2f715359f0af11c59f60-1"' : 'data-target="#xs-components-links-module-ProjectsModule-9b22a52446ec2f715359f0af11c59f60-1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ProjectsModule-9b22a52446ec2f715359f0af11c59f60-1"' :
                                            'id="xs-components-links-module-ProjectsModule-9b22a52446ec2f715359f0af11c59f60-1"' }>
                                            <li class="link">
                                                <a href="components/ProjectStatusComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProjectStatusComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProjectViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProjectViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProjectWizardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProjectWizardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProjectsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProjectsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProjectsRoutingModule.html" data-type="entity-link">ProjectsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RabbitmqModule.html" data-type="entity-link">RabbitmqModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-RabbitmqModule-a258e28e9429a20b6bdb8e983e463a02"' : 'data-target="#xs-controllers-links-module-RabbitmqModule-a258e28e9429a20b6bdb8e983e463a02"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RabbitmqModule-a258e28e9429a20b6bdb8e983e463a02"' :
                                            'id="xs-controllers-links-module-RabbitmqModule-a258e28e9429a20b6bdb8e983e463a02"' }>
                                            <li class="link">
                                                <a href="controllers/RabbitMQController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RabbitMQController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-RabbitmqModule-a258e28e9429a20b6bdb8e983e463a02"' : 'data-target="#xs-injectables-links-module-RabbitmqModule-a258e28e9429a20b6bdb8e983e463a02"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RabbitmqModule-a258e28e9429a20b6bdb8e983e463a02"' :
                                        'id="xs-injectables-links-module-RabbitmqModule-a258e28e9429a20b6bdb8e983e463a02"' }>
                                        <li class="link">
                                            <a href="injectables/RabbitMQService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>RabbitMQService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RabbitmqModule.html" data-type="entity-link">RabbitmqModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-RabbitmqModule-75c131143ceeffe2e924bcf767afdca6-1"' : 'data-target="#xs-components-links-module-RabbitmqModule-75c131143ceeffe2e924bcf767afdca6-1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RabbitmqModule-75c131143ceeffe2e924bcf767afdca6-1"' :
                                            'id="xs-components-links-module-RabbitmqModule-75c131143ceeffe2e924bcf767afdca6-1"' }>
                                            <li class="link">
                                                <a href="components/RabbitMQViewComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RabbitMQViewComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RabbitmqComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RabbitmqComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RabbitmqStatusComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RabbitmqStatusComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RabbitmqWizardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RabbitmqWizardComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/RabbitmqRoutingModule.html" data-type="entity-link">RabbitmqRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RadiusModule.html" data-type="entity-link">RadiusModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-RadiusModule-2658d8a8a1055172e4e24d6f4bb399b9"' : 'data-target="#xs-controllers-links-module-RadiusModule-2658d8a8a1055172e4e24d6f4bb399b9"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RadiusModule-2658d8a8a1055172e4e24d6f4bb399b9"' :
                                            'id="xs-controllers-links-module-RadiusModule-2658d8a8a1055172e4e24d6f4bb399b9"' }>
                                            <li class="link">
                                                <a href="controllers/RadiusController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RadiusController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-RadiusModule-2658d8a8a1055172e4e24d6f4bb399b9"' : 'data-target="#xs-injectables-links-module-RadiusModule-2658d8a8a1055172e4e24d6f4bb399b9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RadiusModule-2658d8a8a1055172e4e24d6f4bb399b9"' :
                                        'id="xs-injectables-links-module-RadiusModule-2658d8a8a1055172e4e24d6f4bb399b9"' }>
                                        <li class="link">
                                            <a href="injectables/RadiusService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>RadiusService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RadiusModule.html" data-type="entity-link">RadiusModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-RadiusModule-c41ae867bdab8535fb097eda4e182868-1"' : 'data-target="#xs-components-links-module-RadiusModule-c41ae867bdab8535fb097eda4e182868-1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RadiusModule-c41ae867bdab8535fb097eda4e182868-1"' :
                                            'id="xs-components-links-module-RadiusModule-c41ae867bdab8535fb097eda4e182868-1"' }>
                                            <li class="link">
                                                <a href="components/RadiusComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RadiusComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/RadiusRoutingModule.html" data-type="entity-link">RadiusRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RedisModule.html" data-type="entity-link">RedisModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-RedisModule-b22dc82b6eb7c2b611e8bdc7da7d5c35"' : 'data-target="#xs-components-links-module-RedisModule-b22dc82b6eb7c2b611e8bdc7da7d5c35"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RedisModule-b22dc82b6eb7c2b611e8bdc7da7d5c35"' :
                                            'id="xs-components-links-module-RedisModule-b22dc82b6eb7c2b611e8bdc7da7d5c35"' }>
                                            <li class="link">
                                                <a href="components/RedisComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RedisComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/RedisRoutingModule.html" data-type="entity-link">RedisRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link">SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedModule-284f27eef430387c5e9da152f19e50b2"' : 'data-target="#xs-components-links-module-SharedModule-284f27eef430387c5e9da152f19e50b2"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-284f27eef430387c5e9da152f19e50b2"' :
                                            'id="xs-components-links-module-SharedModule-284f27eef430387c5e9da152f19e50b2"' }>
                                            <li class="link">
                                                <a href="components/TerraformModuleWizardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TerraformModuleWizardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TerraformRepresentationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TerraformRepresentationComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-SharedModule-284f27eef430387c5e9da152f19e50b2"' : 'data-target="#xs-directives-links-module-SharedModule-284f27eef430387c5e9da152f19e50b2"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-SharedModule-284f27eef430387c5e9da152f19e50b2"' :
                                        'id="xs-directives-links-module-SharedModule-284f27eef430387c5e9da152f19e50b2"' }>
                                        <li class="link">
                                            <a href="directives/TerraformModuleWizardVarsDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">TerraformModuleWizardVarsDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SharedModule-284f27eef430387c5e9da152f19e50b2"' : 'data-target="#xs-injectables-links-module-SharedModule-284f27eef430387c5e9da152f19e50b2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SharedModule-284f27eef430387c5e9da152f19e50b2"' :
                                        'id="xs-injectables-links-module-SharedModule-284f27eef430387c5e9da152f19e50b2"' }>
                                        <li class="link">
                                            <a href="injectables/TerraformWebSocket.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>TerraformWebSocket</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StorageModule.html" data-type="entity-link">StorageModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StorageRoutingModule.html" data-type="entity-link">StorageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TerraformModule.html" data-type="entity-link">TerraformModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TerraformStateModule.html" data-type="entity-link">TerraformStateModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-TerraformStateModule-40493025db42fa26a828e4411294e8d5"' : 'data-target="#xs-controllers-links-module-TerraformStateModule-40493025db42fa26a828e4411294e8d5"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-TerraformStateModule-40493025db42fa26a828e4411294e8d5"' :
                                            'id="xs-controllers-links-module-TerraformStateModule-40493025db42fa26a828e4411294e8d5"' }>
                                            <li class="link">
                                                <a href="controllers/TerraformStateController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TerraformStateController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-TerraformStateModule-40493025db42fa26a828e4411294e8d5"' : 'data-target="#xs-injectables-links-module-TerraformStateModule-40493025db42fa26a828e4411294e8d5"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TerraformStateModule-40493025db42fa26a828e4411294e8d5"' :
                                        'id="xs-injectables-links-module-TerraformStateModule-40493025db42fa26a828e4411294e8d5"' }>
                                        <li class="link">
                                            <a href="injectables/BasicAuthStrategy.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>BasicAuthStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TerraformStateService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>TerraformStateService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TerraformStateModule.html" data-type="entity-link">TerraformStateModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TerraformStateModule-0645cb27a2838f4b2929e6aafbf625d5-1"' : 'data-target="#xs-components-links-module-TerraformStateModule-0645cb27a2838f4b2929e6aafbf625d5-1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TerraformStateModule-0645cb27a2838f4b2929e6aafbf625d5-1"' :
                                            'id="xs-components-links-module-TerraformStateModule-0645cb27a2838f4b2929e6aafbf625d5-1"' }>
                                            <li class="link">
                                                <a href="components/DisplayTerraformStateDialogComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DisplayTerraformStateDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TerraformStateComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TerraformStateComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TerraformStateRoutingModule.html" data-type="entity-link">TerraformStateRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TracingModule.html" data-type="entity-link">TracingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TracingRoutingModule.html" data-type="entity-link">TracingRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/DashboardComponent-1.html" data-type="entity-link">DashboardComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AllExceptionsFilter.html" data-type="entity-link">AllExceptionsFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApiInterceptor.html" data-type="entity-link">ApiInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApplyConsulCommand.html" data-type="entity-link">ApplyConsulCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApplyConsulHandler.html" data-type="entity-link">ApplyConsulHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApplyInstanceCommand.html" data-type="entity-link">ApplyInstanceCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApplyInstanceHandler.html" data-type="entity-link">ApplyInstanceHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApplyJenkinsCommand.html" data-type="entity-link">ApplyJenkinsCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApplyJenkinsHandler.html" data-type="entity-link">ApplyJenkinsHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApplyModuleDTO.html" data-type="entity-link">ApplyModuleDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApplyProjectCommand.html" data-type="entity-link">ApplyProjectCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApplyProjectHandler.html" data-type="entity-link">ApplyProjectHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApplyRabbitMQCommand.html" data-type="entity-link">ApplyRabbitMQCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApplyRabbitMQHandler.html" data-type="entity-link">ApplyRabbitMQHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/Base.html" data-type="entity-link">Base</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseType.html" data-type="entity-link">BaseType</a>
                            </li>
                            <li class="link">
                                <a href="classes/BuildImageCommandHandler.html" data-type="entity-link">BuildImageCommandHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/BuildModuleImageCommand.html" data-type="entity-link">BuildModuleImageCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/CloudPlatform.html" data-type="entity-link">CloudPlatform</a>
                            </li>
                            <li class="link">
                                <a href="classes/Cloudprovider.html" data-type="entity-link">Cloudprovider</a>
                            </li>
                            <li class="link">
                                <a href="classes/CloudproviderDTO.html" data-type="entity-link">CloudproviderDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CloudproviderType.html" data-type="entity-link">CloudproviderType</a>
                            </li>
                            <li class="link">
                                <a href="classes/CollectionDetail.html" data-type="entity-link">CollectionDetail</a>
                            </li>
                            <li class="link">
                                <a href="classes/CollectionImport.html" data-type="entity-link">CollectionImport</a>
                            </li>
                            <li class="link">
                                <a href="classes/CollectionList.html" data-type="entity-link">CollectionList</a>
                            </li>
                            <li class="link">
                                <a href="classes/CollectionUpload.html" data-type="entity-link">CollectionUpload</a>
                            </li>
                            <li class="link">
                                <a href="classes/CollectionVersion.html" data-type="entity-link">CollectionVersion</a>
                            </li>
                            <li class="link">
                                <a href="classes/ColumnDef.html" data-type="entity-link">ColumnDef</a>
                            </li>
                            <li class="link">
                                <a href="classes/Consul.html" data-type="entity-link">Consul</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConsulDTO.html" data-type="entity-link">ConsulDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/Content.html" data-type="entity-link">Content</a>
                            </li>
                            <li class="link">
                                <a href="classes/Content-1.html" data-type="entity-link">Content</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContentSummary.html" data-type="entity-link">ContentSummary</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContentType.html" data-type="entity-link">ContentType</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContentTypeCounts.html" data-type="entity-link">ContentTypeCounts</a>
                            </li>
                            <li class="link">
                                <a href="classes/DefaultParams.html" data-type="entity-link">DefaultParams</a>
                            </li>
                            <li class="link">
                                <a href="classes/DestroyConsulCommand.html" data-type="entity-link">DestroyConsulCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/DestroyConsulHandler.html" data-type="entity-link">DestroyConsulHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DestroyInstanceCommand.html" data-type="entity-link">DestroyInstanceCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/DestroyInstanceHandler.html" data-type="entity-link">DestroyInstanceHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DestroyJenkinsCommand.html" data-type="entity-link">DestroyJenkinsCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/DestroyJenkinsHandler.html" data-type="entity-link">DestroyJenkinsHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DestroyProjectCommand.html" data-type="entity-link">DestroyProjectCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/DestroyProjectHandler.html" data-type="entity-link">DestroyProjectHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DestroyRabbitMQCommand.html" data-type="entity-link">DestroyRabbitMQCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/DestroyRabbitMQHandler.html" data-type="entity-link">DestroyRabbitMQHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/Filter.html" data-type="entity-link">Filter</a>
                            </li>
                            <li class="link">
                                <a href="classes/FilterArray.html" data-type="entity-link">FilterArray</a>
                            </li>
                            <li class="link">
                                <a href="classes/FilterBarCustomButton.html" data-type="entity-link">FilterBarCustomButton</a>
                            </li>
                            <li class="link">
                                <a href="classes/FilterText.html" data-type="entity-link">FilterText</a>
                            </li>
                            <li class="link">
                                <a href="classes/GenericQuery.html" data-type="entity-link">GenericQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GenericQuerySave.html" data-type="entity-link">GenericQuerySave</a>
                            </li>
                            <li class="link">
                                <a href="classes/GitlabDTO.html" data-type="entity-link">GitlabDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ImporterMessage.html" data-type="entity-link">ImporterMessage</a>
                            </li>
                            <li class="link">
                                <a href="classes/ImportLatest.html" data-type="entity-link">ImportLatest</a>
                            </li>
                            <li class="link">
                                <a href="classes/ImportList.html" data-type="entity-link">ImportList</a>
                            </li>
                            <li class="link">
                                <a href="classes/Instance.html" data-type="entity-link">Instance</a>
                            </li>
                            <li class="link">
                                <a href="classes/InstanceDTO.html" data-type="entity-link">InstanceDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/Jenkins.html" data-type="entity-link">Jenkins</a>
                            </li>
                            <li class="link">
                                <a href="classes/JenkinsDTO.html" data-type="entity-link">JenkinsDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/JenkinsSlaveGroup.html" data-type="entity-link">JenkinsSlaveGroup</a>
                            </li>
                            <li class="link">
                                <a href="classes/JenkinsSlaveGroupDTO.html" data-type="entity-link">JenkinsSlaveGroupDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/KeyCloakAdminRequest.html" data-type="entity-link">KeyCloakAdminRequest</a>
                            </li>
                            <li class="link">
                                <a href="classes/MatCrudComponent.html" data-type="entity-link">MatCrudComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/Namespace.html" data-type="entity-link">Namespace</a>
                            </li>
                            <li class="link">
                                <a href="classes/Namespace-1.html" data-type="entity-link">Namespace</a>
                            </li>
                            <li class="link">
                                <a href="classes/Notification.html" data-type="entity-link">Notification</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotificationInterceptor.html" data-type="entity-link">NotificationInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="classes/Owner.html" data-type="entity-link">Owner</a>
                            </li>
                            <li class="link">
                                <a href="classes/Packer.html" data-type="entity-link">Packer</a>
                            </li>
                            <li class="link">
                                <a href="classes/PagedResponse.html" data-type="entity-link">PagedResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginatedCombinedSearch.html" data-type="entity-link">PaginatedCombinedSearch</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginatedRepoCollection.html" data-type="entity-link">PaginatedRepoCollection</a>
                            </li>
                            <li class="link">
                                <a href="classes/Pagination.html" data-type="entity-link">Pagination</a>
                            </li>
                            <li class="link">
                                <a href="classes/ParseError.html" data-type="entity-link">ParseError</a>
                            </li>
                            <li class="link">
                                <a href="classes/PipeTransformSpec.html" data-type="entity-link">PipeTransformSpec</a>
                            </li>
                            <li class="link">
                                <a href="classes/PlanConsulCommand.html" data-type="entity-link">PlanConsulCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/PlanConsulHandler.html" data-type="entity-link">PlanConsulHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/PlanInstanceCommand.html" data-type="entity-link">PlanInstanceCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/PlanInstanceHandler.html" data-type="entity-link">PlanInstanceHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/PlanJenkinsCommand.html" data-type="entity-link">PlanJenkinsCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/PlanJenkinsHandler.html" data-type="entity-link">PlanJenkinsHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/PlanProjectCommand.html" data-type="entity-link">PlanProjectCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/PlanProjectHandler.html" data-type="entity-link">PlanProjectHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/PlanRabbitMQCommand.html" data-type="entity-link">PlanRabbitMQCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/PlanRabbitMQHandler.html" data-type="entity-link">PlanRabbitMQHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/Platform.html" data-type="entity-link">Platform</a>
                            </li>
                            <li class="link">
                                <a href="classes/PostgresqlDTO.html" data-type="entity-link">PostgresqlDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/Project.html" data-type="entity-link">Project</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProjectDefinitionDTO.html" data-type="entity-link">ProjectDefinitionDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProjectDTO.html" data-type="entity-link">ProjectDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/Provider.html" data-type="entity-link">Provider</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProviderNamespace.html" data-type="entity-link">ProviderNamespace</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProviderNamespace-1.html" data-type="entity-link">ProviderNamespace</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProviderSource.html" data-type="entity-link">ProviderSource</a>
                            </li>
                            <li class="link">
                                <a href="classes/RabbitMQ.html" data-type="entity-link">RabbitMQ</a>
                            </li>
                            <li class="link">
                                <a href="classes/RabbitMQDTO.html" data-type="entity-link">RabbitMQDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/Related.html" data-type="entity-link">Related</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepoImport.html" data-type="entity-link">RepoImport</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepoOrCollectionResponse.html" data-type="entity-link">RepoOrCollectionResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/Repository.html" data-type="entity-link">Repository</a>
                            </li>
                            <li class="link">
                                <a href="classes/Repository-1.html" data-type="entity-link">Repository</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepositoryImport.html" data-type="entity-link">RepositoryImport</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepositoryImportSave.html" data-type="entity-link">RepositoryImportSave</a>
                            </li>
                            <li class="link">
                                <a href="classes/RepositorySource.html" data-type="entity-link">RepositorySource</a>
                            </li>
                            <li class="link">
                                <a href="classes/ServerInfo.html" data-type="entity-link">ServerInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/ServiceBase.html" data-type="entity-link">ServiceBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/SideNavMenu.html" data-type="entity-link">SideNavMenu</a>
                            </li>
                            <li class="link">
                                <a href="classes/SideNavMenuGroup.html" data-type="entity-link">SideNavMenuGroup</a>
                            </li>
                            <li class="link">
                                <a href="classes/SummaryFields.html" data-type="entity-link">SummaryFields</a>
                            </li>
                            <li class="link">
                                <a href="classes/Tag.html" data-type="entity-link">Tag</a>
                            </li>
                            <li class="link">
                                <a href="classes/TaskMessage.html" data-type="entity-link">TaskMessage</a>
                            </li>
                            <li class="link">
                                <a href="classes/Terraform.html" data-type="entity-link">Terraform</a>
                            </li>
                            <li class="link">
                                <a href="classes/TerraformGateway.html" data-type="entity-link">TerraformGateway</a>
                            </li>
                            <li class="link">
                                <a href="classes/TerraformModuleEntityInfo.html" data-type="entity-link">TerraformModuleEntityInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/TerraformModuleResourceServiceBase.html" data-type="entity-link">TerraformModuleResourceServiceBase</a>
                            </li>
                            <li class="link">
                                <a href="classes/TerraformModuleWizard.html" data-type="entity-link">TerraformModuleWizard</a>
                            </li>
                            <li class="link">
                                <a href="classes/TerraformState.html" data-type="entity-link">TerraformState</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link">User</a>
                            </li>
                            <li class="link">
                                <a href="classes/Version.html" data-type="entity-link">Version</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AdminIamService-1.html" data-type="entity-link">AdminIamService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthzMiddleware.html" data-type="entity-link">AuthzMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CloudPlatformService.html" data-type="entity-link">CloudPlatformService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CollectionDetailService.html" data-type="entity-link">CollectionDetailService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CollectionListService.html" data-type="entity-link">CollectionListService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CollectionUploadService.html" data-type="entity-link">CollectionUploadService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfirmDialogService.html" data-type="entity-link">ConfirmDialogService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConsulService-1.html" data-type="entity-link">ConsulService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ContentService.html" data-type="entity-link">ContentService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ContentTypeService.html" data-type="entity-link">ContentTypeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ContextualMenuService.html" data-type="entity-link">ContextualMenuService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FlavorsService-1.html" data-type="entity-link">FlavorsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GalaxyService.html" data-type="entity-link">GalaxyService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GitlabService-1.html" data-type="entity-link">GitlabService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IamService-1.html" data-type="entity-link">IamService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ImagesService-1.html" data-type="entity-link">ImagesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ImportsService.html" data-type="entity-link">ImportsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/InstancesService-1.html" data-type="entity-link">InstancesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JenkinsService-1.html" data-type="entity-link">JenkinsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/KeycloakIdpService.html" data-type="entity-link">KeycloakIdpService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NamespaceService.html" data-type="entity-link">NamespaceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PageLoadingService.html" data-type="entity-link">PageLoadingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PlatformService.html" data-type="entity-link">PlatformService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PostgresqlService.html" data-type="entity-link">PostgresqlService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProjectProviderMiddleware.html" data-type="entity-link">ProjectProviderMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProjectsService-1.html" data-type="entity-link">ProjectsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProviderService.html" data-type="entity-link">ProviderService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProviderSourceService.html" data-type="entity-link">ProviderSourceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RabbitMQService-1.html" data-type="entity-link">RabbitMQService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RepoCollectionListService.html" data-type="entity-link">RepoCollectionListService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RepoCollectionSearchService.html" data-type="entity-link">RepoCollectionSearchService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RepoOrCollectionService.html" data-type="entity-link">RepoOrCollectionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RepositoryImportService.html" data-type="entity-link">RepositoryImportService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RepositoryService.html" data-type="entity-link">RepositoryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TagsService.html" data-type="entity-link">TagsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TerraformStateService-1.html" data-type="entity-link">TerraformStateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ThemeService.html" data-type="entity-link">ThemeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link">UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthzGuard.html" data-type="entity-link">AuthzGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/AvailabilityZonesResolver.html" data-type="entity-link">AvailabilityZonesResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/CloudFlavorsResolver.html" data-type="entity-link">CloudFlavorsResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/CloudImagesResolver.html" data-type="entity-link">CloudImagesResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/ConsulResolver.html" data-type="entity-link">ConsulResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/CurrentConsulResolver.html" data-type="entity-link">CurrentConsulResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/CurrentGitlabResolver.html" data-type="entity-link">CurrentGitlabResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/CurrentInstanceResolver.html" data-type="entity-link">CurrentInstanceResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/CurrentJenkinsResolver.html" data-type="entity-link">CurrentJenkinsResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/CurrentPostgresqlResolver.html" data-type="entity-link">CurrentPostgresqlResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/CurrentProjectResolver.html" data-type="entity-link">CurrentProjectResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/CurrentRabbitMQResolver.html" data-type="entity-link">CurrentRabbitMQResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/GitlabResolver.html" data-type="entity-link">GitlabResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/InstanceResolver.html" data-type="entity-link">InstanceResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/JenkinsResolver.html" data-type="entity-link">JenkinsResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/MandatorySelectedProjectGuard.html" data-type="entity-link">MandatorySelectedProjectGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/NamespaceListResolver.html" data-type="entity-link">NamespaceListResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/PopularCloudPlatformsResolver.html" data-type="entity-link">PopularCloudPlatformsResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/PopularPlatformsResolver.html" data-type="entity-link">PopularPlatformsResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/PopularTagsResolver.html" data-type="entity-link">PopularTagsResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/PostgresqlResolver.html" data-type="entity-link">PostgresqlResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/ProviderListResolver.html" data-type="entity-link">ProviderListResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/ProviderSourceListResolver.html" data-type="entity-link">ProviderSourceListResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/RabbitMQResolver.html" data-type="entity-link">RabbitMQResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/RepoContentDetailResolver.html" data-type="entity-link">RepoContentDetailResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/SearchCloudPlatformResolver.html" data-type="entity-link">SearchCloudPlatformResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/SearchContentResolver.html" data-type="entity-link">SearchContentResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/SearchContentTypeResolver.html" data-type="entity-link">SearchContentTypeResolver</a>
                            </li>
                            <li class="link">
                                <a href="guards/SearchPlatformResolver.html" data-type="entity-link">SearchPlatformResolver</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ActionMapping.html" data-type="entity-link">ActionMapping</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApplyOptions.html" data-type="entity-link">ApplyOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AttributeValue.html" data-type="entity-link">AttributeValue</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Changed.html" data-type="entity-link">Changed</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChangedAttribute.html" data-type="entity-link">ChangedAttribute</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChangedAttributesMap.html" data-type="entity-link">ChangedAttributesMap</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CredentialRepresentation.html" data-type="entity-link">CredentialRepresentation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DataProvider.html" data-type="entity-link">DataProvider</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DestroyOptions.html" data-type="entity-link">DestroyOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExecuteOptions.html" data-type="entity-link">ExecuteOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FederatedIdentityRepresentation.html" data-type="entity-link">FederatedIdentityRepresentation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICloudApi.html" data-type="entity-link">ICloudApi</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICloudApiAvailabilityZone.html" data-type="entity-link">ICloudApiAvailabilityZone</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICloudApiConfig.html" data-type="entity-link">ICloudApiConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICloudApiDisk.html" data-type="entity-link">ICloudApiDisk</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICloudApiFlavor.html" data-type="entity-link">ICloudApiFlavor</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICloudApiImage.html" data-type="entity-link">ICloudApiImage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICloudApiInfo.html" data-type="entity-link">ICloudApiInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICloudApiInstance.html" data-type="entity-link">ICloudApiInstance</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICloudApiInstanceAdress.html" data-type="entity-link">ICloudApiInstanceAdress</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICloudApiNetwork.html" data-type="entity-link">ICloudApiNetwork</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICloudApiProjectFloatingIp.html" data-type="entity-link">ICloudApiProjectFloatingIp</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICloudApiProjectFloatingIpPool.html" data-type="entity-link">ICloudApiProjectFloatingIpPool</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICloudApiProjectQuota.html" data-type="entity-link">ICloudApiProjectQuota</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICloudApiProjectQuotaDetail.html" data-type="entity-link">ICloudApiProjectQuotaDetail</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICloudApiProjectRouter.html" data-type="entity-link">ICloudApiProjectRouter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGitInfo.html" data-type="entity-link">IGitInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMe.html" data-type="entity-link">IMe</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InteractiveOptions.html" data-type="entity-link">InteractiveOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPackerModuleInfo.html" data-type="entity-link">IPackerModuleInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPaginationOptions.html" data-type="entity-link">IPaginationOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IServerInfo.html" data-type="entity-link">IServerInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITerraformInfo.html" data-type="entity-link">ITerraformInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITerraformModuleInfo.html" data-type="entity-link">ITerraformModuleInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Logger.html" data-type="entity-link">Logger</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ModuleImageToBuildDTO.html" data-type="entity-link">ModuleImageToBuildDTO</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OutputObject.html" data-type="entity-link">OutputObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OutputOptions.html" data-type="entity-link">OutputOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ParseResult.html" data-type="entity-link">ParseResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RequiredActionProviderRepresentation.html" data-type="entity-link">RequiredActionProviderRepresentation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SimpleOutputObject.html" data-type="entity-link">SimpleOutputObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StdInterface.html" data-type="entity-link">StdInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TerraformApplyEvent.html" data-type="entity-link">TerraformApplyEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TerraformDestroyEvent.html" data-type="entity-link">TerraformDestroyEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TerraformModuleWizardVarsProvider.html" data-type="entity-link">TerraformModuleWizardVarsProvider</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TerraformPlanEvent.html" data-type="entity-link">TerraformPlanEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TerraformStateDTO.html" data-type="entity-link">TerraformStateDTO</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TFChangeRepresentation.html" data-type="entity-link">TFChangeRepresentation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TFConfigRepresentation.html" data-type="entity-link">TFConfigRepresentation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TFPlanRepresentation.html" data-type="entity-link">TFPlanRepresentation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TFResource.html" data-type="entity-link">TFResource</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TFResourceChange.html" data-type="entity-link">TFResourceChange</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TFStateRepresentation.html" data-type="entity-link">TFStateRepresentation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TFValueChildModule.html" data-type="entity-link">TFValueChildModule</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TFValueRootModule.html" data-type="entity-link">TFValueRootModule</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TFValuesRepresentation.html" data-type="entity-link">TFValuesRepresentation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserConsentRepresentation.html" data-type="entity-link">UserConsentRepresentation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserRepresentation.html" data-type="entity-link">UserRepresentation</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});