define([], function () {
  return {
    PropertyPaneDescription: 'Settings for scoped CSS on this page.',
    AppearanceGroupName: 'Appearance',
    HideWebPartUiLabel: 'Hide web part chrome on the page',
    HideWebPartUiDescription:
      'Hides the whole web part section (SharePoint wrapper), not just the inner markup. Handy when you only want CSS injection with no visible frame.',
    CustomCssGroupName: 'Custom CSS',
    CustomCssFieldLabel: 'Extra CSS (paste)',
    CustomCssFieldDescription:
      'Rules here are appended after the built-in sample. Prefer selectors under body[data-custom-css="true"] for safer scoping.',
    WebPartPlaceholderTitle: 'Custom CSS Injector',
    WebPartPlaceholderDescription:
      'Injects CSS into the document head. Open the web part properties to paste additional rules.'
  };
});
