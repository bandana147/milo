import{l as t,o as e,s as i,e as s,A as n,x as r,i as o,a}from"./1bd6a5fb.js";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function l(i,s,n){let r,o=i;return"object"==typeof i?(o=i.slot,r=i):r={flatten:s},n?t({slot:o,flatten:s,selector:n}):e({descriptor:t=>({get(){var t,e;const i="slot"+(o?`[name=${o}]`:":not([name])"),s=null===(t=this.renderRoot)||void 0===t?void 0:t.querySelector(i);return null!==(e=null==s?void 0:s.assignedNodes(r))&&void 0!==e?e:[]},enumerable:!0,configurable:!0})})}const c=new Set,h=new MutationObserver((()=>{const t="rtl"===document.documentElement.dir?document.documentElement.dir:"ltr";c.forEach((e=>{e.setAttribute("dir",t)}))}));h.observe(document.documentElement,{attributes:!0,attributeFilter:["dir"]});const d=t=>void 0!==t.startManagingContentDirection||"SP-THEME"===t.tagName;class u extends(function(t){return class extends t{get isLTR(){return"ltr"===this.dir}hasVisibleFocusInTree(){const t=this.getRootNode().activeElement;if(!t)return!1;try{return t.matches(":focus-visible")||t.matches(".focus-visible")}catch(e){return t.matches(".focus-visible")}}connectedCallback(){if(!this.hasAttribute("dir")){let t=this.assignedSlot||this.parentNode;for(;t!==document.documentElement&&!d(t);)t=t.assignedSlot||t.parentNode||t.host;if(this.dir="rtl"===t.dir?t.dir:this.dir||"ltr",t===document.documentElement)c.add(this);else{const{localName:e}=t;e.search("-")>-1&&!customElements.get(e)?customElements.whenDefined(e).then((()=>{t.startManagingContentDirection(this)})):t.startManagingContentDirection(this)}this._dirParent=t}super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback(),this._dirParent&&(this._dirParent===document.documentElement?c.delete(this):this._dirParent.stopManagingContentDirection(this),this.removeAttribute("dir"))}}}(i)){}var p=Object.defineProperty,m=Object.getOwnPropertyDescriptor;function b(t,{validSizes:e=["s","m","l","xl"],noDefaultSize:i,defaultSize:n="m"}={}){class r extends t{constructor(){super(...arguments),this._size=n}get size(){return this._size||n}set size(t){const s=i?null:n,r=t&&t.toLocaleLowerCase(),o=e.includes(r)?r:s;if(o&&this.setAttribute("size",o),this._size===o)return;const a=this._size;this._size=o,this.requestUpdate("size",a)}update(t){!this.hasAttribute("size")&&!i&&this.setAttribute("size",this.size),super.update(t)}}return((t,e,i,s)=>{for(var n,r=s>1?void 0:s?m(e,i):e,o=t.length-1;o>=0;o--)(n=t[o])&&(r=(s?n(e,i,r):n(r))||r);s&&r&&p(e,i,r)})([s({type:String,reflect:!0})],r.prototype,"size",1),r
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */}const v=t=>null!=t?t:n;var f=Object.defineProperty,g=Object.getOwnPropertyDescriptor,y=(t,e,i,s)=>{for(var n,r=s>1?void 0:s?g(e,i):e,o=t.length-1;o>=0;o--)(n=t[o])&&(r=(s?n(e,i,r):n(r))||r);return s&&r&&f(e,i,r),r};let w=!0;try{document.body.querySelector(":focus-visible")}catch(p){w=!1,import("./81b9f6a0.js")}const z=t=>{var e;const i=Symbol("endPolyfillCoordination");return e=i,class extends t{constructor(){super(...arguments),this[e]=null}connectedCallback(){super.connectedCallback&&super.connectedCallback(),w||requestAnimationFrame((()=>{null==this[i]&&(this[i]=(t=>{if(null==t.shadowRoot||t.hasAttribute("data-js-focus-visible"))return()=>{};if(!self.applyFocusVisiblePolyfill){const e=()=>{self.applyFocusVisiblePolyfill&&t.shadowRoot&&self.applyFocusVisiblePolyfill(t.shadowRoot),t.manageAutoFocus&&t.manageAutoFocus()};return self.addEventListener("focus-visible-polyfill-ready",e,{once:!0}),()=>{self.removeEventListener("focus-visible-polyfill-ready",e)}}return self.applyFocusVisiblePolyfill(t.shadowRoot),t.manageAutoFocus&&t.manageAutoFocus(),()=>{}})(this))}))}disconnectedCallback(){super.disconnectedCallback&&super.disconnectedCallback(),w||requestAnimationFrame((()=>{null!=this[i]&&(this[i](),this[i]=null)}))}}};var x=Object.defineProperty,E=Object.getOwnPropertyDescriptor,k=(t,e,i,s)=>{for(var n,r=s>1?void 0:s?E(e,i):e,o=t.length-1;o>=0;o--)(n=t[o])&&(r=(s?n(e,i,r):n(r))||r);return s&&r&&x(e,i,r),r};function A(){return new Promise((t=>requestAnimationFrame((()=>t()))))}class C extends(z(u)){constructor(){super(...arguments),this.disabled=!1,this.autofocus=!1,this._tabIndex=0,this.manipulatingTabindex=!1,this._recentlyConnected=!1}get tabIndex(){if(this.focusElement===this){const t=this.hasAttribute("tabindex")?Number(this.getAttribute("tabindex")):NaN;return isNaN(t)?-1:t}const t=parseFloat(this.hasAttribute("tabindex")&&this.getAttribute("tabindex")||"0");return this.disabled||t<0?-1:this.focusElement?this.focusElement.tabIndex:t}set tabIndex(t){if(this.manipulatingTabindex)this.manipulatingTabindex=!1;else if(this.focusElement!==this){if(-1===t?this.addEventListener("pointerdown",this.onPointerdownManagementOfTabIndex):(this.manipulatingTabindex=!0,this.removeEventListener("pointerdown",this.onPointerdownManagementOfTabIndex)),-1===t||this.disabled)return this.setAttribute("tabindex","-1"),this.removeAttribute("focusable"),void(-1!==t&&this.manageFocusElementTabindex(t));this.setAttribute("focusable",""),this.hasAttribute("tabindex")?this.removeAttribute("tabindex"):this.manipulatingTabindex=!1,this.manageFocusElementTabindex(t)}else if(t!==this.tabIndex){this._tabIndex=t;const e=this.disabled?"-1":""+t;this.setAttribute("tabindex",e)}}onPointerdownManagementOfTabIndex(){-1===this.tabIndex&&(this.tabIndex=0,this.focus({preventScroll:!0}))}async manageFocusElementTabindex(t){this.focusElement||await this.updateComplete,null===t?this.focusElement.removeAttribute("tabindex"):this.focusElement.tabIndex=t}get focusElement(){throw new Error("Must implement focusElement getter!")}focus(t){this.disabled||!this.focusElement||(this.focusElement!==this?this.focusElement.focus(t):HTMLElement.prototype.focus.apply(this,[t]))}blur(){const t=this.focusElement||this;t!==this?t.blur():HTMLElement.prototype.blur.apply(this)}click(){if(this.disabled)return;const t=this.focusElement||this;t!==this?t.click():HTMLElement.prototype.click.apply(this)}manageAutoFocus(){this.autofocus&&(this.dispatchEvent(new KeyboardEvent("keydown",{code:"Tab"})),this.focusElement.focus())}firstUpdated(t){super.firstUpdated(t),(!this.hasAttribute("tabindex")||"-1"!==this.getAttribute("tabindex"))&&this.setAttribute("focusable","")}update(t){t.has("disabled")&&this.handleDisabledChanged(this.disabled,t.get("disabled")),super.update(t)}updated(t){super.updated(t),t.has("disabled")&&this.disabled&&this.blur()}async handleDisabledChanged(t,e){const i=()=>this.focusElement!==this&&void 0!==this.focusElement.disabled;t?(this.manipulatingTabindex=!0,this.setAttribute("tabindex","-1"),await this.updateComplete,i()?this.focusElement.disabled=!0:this.setAttribute("aria-disabled","true")):e&&(this.manipulatingTabindex=!0,this.focusElement===this?this.setAttribute("tabindex",""+this._tabIndex):this.removeAttribute("tabindex"),await this.updateComplete,i()?this.focusElement.disabled=!1:this.removeAttribute("aria-disabled"))}async getUpdateComplete(){const t=await super.getUpdateComplete();return this._recentlyConnected&&(this._recentlyConnected=!1,await A(),await A()),t}connectedCallback(){super.connectedCallback(),this._recentlyConnected=!0,this.updateComplete.then((()=>{this.manageAutoFocus()}))}}k([s({type:Boolean,reflect:!0})],C.prototype,"disabled",2),k([s({type:Boolean})],C.prototype,"autofocus",2),k([s({type:Number})],C.prototype,"tabIndex",1);class P{constructor(t,{target:e,config:i,callback:s,skipInitial:n}){this.t=new Set,this.o=!1,this.i=!1,this.h=t,null!==e&&this.t.add(null!=e?e:t),this.l=i,this.o=null!=n?n:this.o,this.callback=s,window.MutationObserver?(this.u=new MutationObserver((t=>{this.handleChanges(t),this.h.requestUpdate()})),t.addController(this)):console.warn("MutationController error: browser does not support MutationObserver.")}handleChanges(t){var e;this.value=null===(e=this.callback)||void 0===e?void 0:e.call(this,t,this.u)}hostConnected(){for(const t of this.t)this.observe(t)}hostDisconnected(){this.disconnect()}async hostUpdated(){const t=this.u.takeRecords();(t.length||!this.o&&this.i)&&this.handleChanges(t),this.i=!1}observe(t){this.t.add(t),this.u.observe(t,this.l),this.i=!0,this.h.requestUpdate()}disconnect(){this.u.disconnect()}}var L=Object.defineProperty,O=Object.getOwnPropertyDescriptor,F=(t,e,i,s)=>{for(var n,r=s>1?void 0:s?O(e,i):e,o=t.length-1;o>=0;o--)(n=t[o])&&(r=(s?n(e,i,r):n(r))||r);return s&&r&&L(e,i,r),r};const T=Symbol("assignedNodes");var S=o`
:host{display:inline-flex;vertical-align:top}:host([dir]){-webkit-appearance:none}:host([disabled]){cursor:auto;pointer-events:none}#button{inset:0;position:absolute}:host:after{pointer-events:none}slot[name=icon]::slotted(img),slot[name=icon]::slotted(svg){fill:currentcolor;stroke:currentcolor;height:var(
--spectrum-alias-workflow-icon-size-m,var(--spectrum-global-dimension-size-225)
);width:var(
--spectrum-alias-workflow-icon-size-m,var(--spectrum-global-dimension-size-225)
)}[icon-only]+#label{display:none}:host([size=s]){--spectrum-icon-tshirt-size-height:var(
--spectrum-alias-workflow-icon-size-s
);--spectrum-icon-tshirt-size-width:var(
--spectrum-alias-workflow-icon-size-s
);--spectrum-ui-icon-tshirt-size-height:var(
--spectrum-alias-ui-icon-cornertriangle-size-75
);--spectrum-ui-icon-tshirt-size-width:var(
--spectrum-alias-ui-icon-cornertriangle-size-75
)}:host([size=m]){--spectrum-icon-tshirt-size-height:var(
--spectrum-alias-workflow-icon-size-m
);--spectrum-icon-tshirt-size-width:var(
--spectrum-alias-workflow-icon-size-m
);--spectrum-ui-icon-tshirt-size-height:var(
--spectrum-alias-ui-icon-cornertriangle-size-100
);--spectrum-ui-icon-tshirt-size-width:var(
--spectrum-alias-ui-icon-cornertriangle-size-100
)}:host([size=l]){--spectrum-icon-tshirt-size-height:var(
--spectrum-alias-workflow-icon-size-l
);--spectrum-icon-tshirt-size-width:var(
--spectrum-alias-workflow-icon-size-l
);--spectrum-ui-icon-tshirt-size-height:var(
--spectrum-alias-ui-icon-cornertriangle-size-200
);--spectrum-ui-icon-tshirt-size-width:var(
--spectrum-alias-ui-icon-cornertriangle-size-200
)}:host([size=xl]){--spectrum-icon-tshirt-size-height:var(
--spectrum-alias-workflow-icon-size-xl
);--spectrum-icon-tshirt-size-width:var(
--spectrum-alias-workflow-icon-size-xl
);--spectrum-ui-icon-tshirt-size-height:var(
--spectrum-alias-ui-icon-cornertriangle-size-300
);--spectrum-ui-icon-tshirt-size-width:var(
--spectrum-alias-ui-icon-cornertriangle-size-300
)}
`,I=Object.defineProperty,j=Object.getOwnPropertyDescriptor,D=(t,e,i,s)=>{for(var n,r=s>1?void 0:s?j(e,i):e,o=t.length-1;o>=0;o--)(n=t[o])&&(r=(s?n(e,i,r):n(r))||r);return s&&r&&I(e,i,r),r};class N extends(function(t,e){var i;class n extends t{constructor(...t){super(t),this.slotHasContent=!1,new P(this,{config:{characterData:!0,subtree:!0},callback:t=>{for(const e of t)if("characterData"===e.type)return void this.manageTextObservedSlot()}})}manageTextObservedSlot(){if(!this[T])return;const t=[...this[T]].filter((t=>!!t.tagName||!!t.textContent&&t.textContent.trim()));this.slotHasContent=t.length>0}update(t){if(!this.hasUpdated){const{childNodes:t}=this,i=[...t].filter((t=>t.tagName?e?t.getAttribute("slot")===e:!t.hasAttribute("slot"):!!t.textContent&&t.textContent.trim()));this.slotHasContent=i.length>0}super.update(t)}firstUpdated(t){super.firstUpdated(t),this.updateComplete.then((()=>{this.manageTextObservedSlot()}))}}return i=T,F([s({type:Boolean,attribute:!1})],n.prototype,"slotHasContent",2),F([l(e,!0)],n.prototype,i,2),n}(function(t){class e extends t{renderAnchor({id:t,className:e,ariaHidden:i,labelledby:s,tabindex:n,anchorContent:o=r`<slot></slot>`}){return r`<a
                    id=${t}
                    class=${v(e)}
                    href=${v(this.href)}
                    download=${v(this.download)}
                    target=${v(this.target)}
                    aria-label=${v(this.label)}
                    aria-labelledby=${v(s)}
                    aria-hidden=${v(i?"true":void 0)}
                    tabindex=${v(n)}
                    rel=${v(this.rel)}
                >${o}</a>`}}return y([s({reflect:!0})],e.prototype,"download",2),y([s()],e.prototype,"label",2),y([s({reflect:!0})],e.prototype,"href",2),y([s({reflect:!0})],e.prototype,"target",2),y([s({reflect:!0})],e.prototype,"rel",2),e}(C))){constructor(){super(),this.active=!1,this.type="button",this.proxyFocus=this.proxyFocus.bind(this),this.addEventListener("click",this.handleClickCapture,{capture:!0})}static get styles(){return[S]}get focusElement(){return this}get hasLabel(){return this.slotHasContent}get buttonContent(){return[r`
                <slot name="icon" ?icon-only=${!this.hasLabel}></slot>
            `,r`
                <span id="label">
                    <slot @slotchange=${this.manageTextObservedSlot}></slot>
                </span>
            `]}click(){this.disabled||this.shouldProxyClick()||super.click()}handleClickCapture(t){if(this.disabled)return t.preventDefault(),t.stopImmediatePropagation(),t.stopPropagation(),!1}proxyFocus(){this.focus()}shouldProxyClick(){let t=!1;if(this.anchorElement)this.anchorElement.click(),t=!0;else if("button"!==this.type){const e=document.createElement("button");e.type=this.type,this.insertAdjacentElement("afterend",e),e.click(),e.remove(),t=!0}return t}renderAnchor(){return r`
            ${this.buttonContent}
            ${super.renderAnchor({id:"button",ariaHidden:!0,className:"button anchor hidden"})}
        `}renderButton(){return r`
            ${this.buttonContent}
        `}render(){return this.href&&this.href.length>0?this.renderAnchor():this.renderButton()}handleKeydown(t){const{code:e}=t;if("Space"===e)t.preventDefault(),void 0===this.href&&(this.addEventListener("keyup",this.handleKeyup),this.active=!0)}handleKeypress(t){const{code:e}=t;switch(e){case"Enter":case"NumpadEnter":this.click()}}handleKeyup(t){const{code:e}=t;if("Space"===e)this.removeEventListener("keyup",this.handleKeyup),this.active=!1,this.click()}handleRemoveActive(){this.active=!1}handlePointerdown(){this.active=!0}manageAnchor(){this.href&&this.href.length>0?("button"===this.getAttribute("role")&&this.setAttribute("role","link"),this.removeEventListener("click",this.shouldProxyClick)):((!this.hasAttribute("role")||"link"===this.getAttribute("role"))&&this.setAttribute("role","button"),this.addEventListener("click",this.shouldProxyClick))}firstUpdated(t){super.firstUpdated(t),this.hasAttribute("tabindex")||(this.tabIndex=0),this.manageAnchor(),this.addEventListener("keydown",this.handleKeydown),this.addEventListener("keypress",this.handleKeypress),this.addEventListener("pointerdown",this.handlePointerdown)}updated(t){super.updated(t),t.has("href")&&this.manageAnchor(),t.has("label")&&this.setAttribute("aria-label",this.label||""),t.has("active")&&(this.active?(this.addEventListener("focusout",this.handleRemoveActive),this.addEventListener("pointerup",this.handleRemoveActive),this.addEventListener("pointercancel",this.handleRemoveActive),this.addEventListener("pointerleave",this.handleRemoveActive)):(this.removeEventListener("focusout",this.handleRemoveActive),this.removeEventListener("pointerup",this.handleRemoveActive),this.removeEventListener("pointercancel",this.handleRemoveActive),this.removeEventListener("pointerleave",this.handleRemoveActive))),this.anchorElement&&(this.anchorElement.addEventListener("focus",this.proxyFocus),this.anchorElement.tabIndex=-1)}}D([s({type:Boolean,reflect:!0})],N.prototype,"active",2),D([s({type:String})],N.prototype,"type",2),D([a(".anchor")],N.prototype,"anchorElement",2);var M=o`
:host{fill:currentColor;color:inherit;display:inline-block;pointer-events:none}:host(:not(:root)){overflow:hidden}@media (forced-colors:active){:host{forced-color-adjust:auto}}:host{--spectrum-icon-size-s:var(
--spectrum-alias-workflow-icon-size-s,var(--spectrum-global-dimension-size-200)
);--spectrum-icon-size-m:var(
--spectrum-alias-workflow-icon-size-m,var(--spectrum-global-dimension-size-225)
);--spectrum-icon-size-l:var(--spectrum-alias-workflow-icon-size-l);--spectrum-icon-size-xl:var(
--spectrum-alias-workflow-icon-size-xl,var(--spectrum-global-dimension-size-275)
);--spectrum-icon-size-xxl:var(--spectrum-global-dimension-size-400)}:host([size=s]){height:var(--spectrum-icon-size-s);width:var(--spectrum-icon-size-s)}:host([size=m]){height:var(--spectrum-icon-size-m);width:var(--spectrum-icon-size-m)}:host([size=l]){height:var(--spectrum-icon-size-l);width:var(--spectrum-icon-size-l)}:host([size=xl]){height:var(--spectrum-icon-size-xl);width:var(--spectrum-icon-size-xl)}:host([size=xxl]){height:var(--spectrum-icon-size-xxl);width:var(--spectrum-icon-size-xxl)}:host{height:var(
--spectrum-icon-tshirt-size-height,var(
--spectrum-alias-workflow-icon-size,var(--spectrum-global-dimension-size-225)
)
);width:var(
--spectrum-icon-tshirt-size-width,var(
--spectrum-alias-workflow-icon-size,var(--spectrum-global-dimension-size-225)
)
)}#container{height:100%}::slotted(*),img,svg{color:inherit;height:100%;vertical-align:top;width:100%}@media (forced-colors:active){::slotted(*),img,svg{forced-color-adjust:auto}}
`,R=Object.defineProperty,$=Object.getOwnPropertyDescriptor,_=(t,e,i,s)=>{for(var n,r=s>1?void 0:s?$(e,i):e,o=t.length-1;o>=0;o--)(n=t[o])&&(r=(s?n(e,i,r):n(r))||r);return s&&r&&R(e,i,r),r};class U extends u{static get styles(){return[M]}render(){return r`
            <slot></slot>
        `}}let H;_([s()],U.prototype,"label",2),_([s({reflect:!0})],U.prototype,"size",2);const q=function(t,...e){return H?H(t,...e):e.reduce(((e,i,s)=>e+i+t[s+1]),t[0])},K=t=>{H=t};export{N as B,C as F,U as I,b as S,u as a,P as b,v as l,K as s,q as t};
