declare interface ICustomCssInjectorWebPartStrings {
  PropertyPaneDescription: string;
  AppearanceGroupName: string;
  HideWebPartUiLabel: string;
  HideWebPartUiDescription: string;
  CustomCssGroupName: string;
  CustomCssFieldLabel: string;
  CustomCssFieldDescription: string;
  WebPartPlaceholderTitle: string;
  WebPartPlaceholderDescription: string;
}

declare module 'CustomCssInjectorWebPartStrings' {
  const strings: ICustomCssInjectorWebPartStrings;
  export = strings;
}
