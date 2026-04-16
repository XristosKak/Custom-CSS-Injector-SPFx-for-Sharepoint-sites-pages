import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import './CustomCssInjectorWebPart.module.scss';
import * as strings from 'CustomCssInjectorWebPartStrings';

export interface ICustomCssInjectorWebPartProps {
  customCss: string;
}

const BODY_SCOPE_ATTRIBUTE = 'data-custom-css';
const BODY_SCOPE_VALUE = 'true';

const STYLE_ID_PREFIX = 'custom-css-injector-style-';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default class CustomCssInjectorWebPart extends BaseClientSideWebPart<ICustomCssInjectorWebPartProps> {
  private static _bodyScopeRefCount: number = 0;

  private _bodyScopeRegistered: boolean = false;

  private _getStyleElementId(): string {
    return `${STYLE_ID_PREFIX}${this.context.instanceId}`;
  }

  private static _incrementBodyScope(): void {
    if (CustomCssInjectorWebPart._bodyScopeRefCount === 0) {
      document.body.setAttribute(BODY_SCOPE_ATTRIBUTE, BODY_SCOPE_VALUE);
    }
    CustomCssInjectorWebPart._bodyScopeRefCount++;
  }

  private static _decrementBodyScope(): void {
    CustomCssInjectorWebPart._bodyScopeRefCount = Math.max(0, CustomCssInjectorWebPart._bodyScopeRefCount - 1);
    if (CustomCssInjectorWebPart._bodyScopeRefCount === 0) {
      document.body.removeAttribute(BODY_SCOPE_ATTRIBUTE);
    }
  }

  private _buildCssText(): string {
    const userCss: string = (this.properties.customCss || '').trim();

    const sampleCss: string = [
      '/* sample: title */',
      `body[${BODY_SCOPE_ATTRIBUTE}="${BODY_SCOPE_VALUE}"] .sp-page-title {`,
      '  color: red !important;',
      '}',
      '',
      '/* sample: swap .some-class */',
      `body[${BODY_SCOPE_ATTRIBUTE}="${BODY_SCOPE_VALUE}"] .some-class {`,
      '  background: #f5f5f5;',
      '}'
    ].join('\n');

    return userCss.length > 0 ? `${sampleCss}\n\n${userCss}` : sampleCss;
  }

  private _injectOrUpdateStyle(): void {
    if (!this._bodyScopeRegistered) {
      CustomCssInjectorWebPart._incrementBodyScope();
      this._bodyScopeRegistered = true;
    }

    const id: string = this._getStyleElementId();
    let styleEl: HTMLStyleElement | null = document.getElementById(id) as HTMLStyleElement | null;

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = id;
      styleEl.type = 'text/css';
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = this._buildCssText();
  }

  private _removeStyleElement(): void {
    const id: string = this._getStyleElementId();
    const existing: HTMLElement | null = document.getElementById(id);
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }
  }

  public render(): void {
    this._injectOrUpdateStyle();

    this.domElement.innerHTML = `
      <section class="ms-Grid">
        <div class="ms-Grid-row">
          <div class="ms-Grid-col ms-sm12">
            <h2 class="ms-font-xl ms-fontColor-neutralPrimary">${escapeHtml(strings.WebPartPlaceholderTitle)}</h2>
            <p class="ms-font-m ms-fontColor-neutralSecondary">${escapeHtml(strings.WebPartPlaceholderDescription)}</p>
          </div>
        </div>
      </section>
    `;
  }

  protected onDispose(): void {
    this._removeStyleElement();

    if (this._bodyScopeRegistered) {
      CustomCssInjectorWebPart._decrementBodyScope();
      this._bodyScopeRegistered = false;
    }

    super.onDispose();
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: unknown, newValue: unknown): void {
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);

    if (propertyPath === 'customCss') {
      this._injectOrUpdateStyle();
    }
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: strings.PropertyPaneDescription },
          groups: [
            {
              groupName: strings.CustomCssGroupName,
              groupFields: [
                PropertyPaneTextField('customCss', {
                  label: strings.CustomCssFieldLabel,
                  multiline: true,
                  rows: 14,
                  description: strings.CustomCssFieldDescription
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
