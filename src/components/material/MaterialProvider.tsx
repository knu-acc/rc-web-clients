"use client";

import { useEffect } from "react";

let registered = false;
let registrationPromise: Promise<void> | null = null;

async function registerMaterialComponents() {
  if (registered) return;
  if (registrationPromise) return registrationPromise;

  registrationPromise = Promise.all([
    import("@material/web/button/filled-button.js"),
    import("@material/web/button/outlined-button.js"),
    import("@material/web/button/text-button.js"),
    import("@material/web/button/filled-tonal-button.js"),
    import("@material/web/textfield/outlined-text-field.js"),
    import("@material/web/textfield/filled-text-field.js"),
    import("@material/web/select/outlined-select.js"),
    import("@material/web/select/select-option.js"),
    import("@material/web/checkbox/checkbox.js"),
    import("@material/web/fab/fab.js"),
    import("@material/web/icon/icon.js"),
    import("@material/web/iconbutton/icon-button.js"),
    import("@material/web/chips/filter-chip.js"),
    import("@material/web/chips/chip-set.js"),
    import("@material/web/progress/circular-progress.js"),
  ])
    .then(async () => {
      const { styles: typescaleStyles } = await import(
        "@material/web/typography/md-typescale-styles.js"
      );
      if (typescaleStyles.styleSheet && !document.adoptedStyleSheets.includes(typescaleStyles.styleSheet)) {
        document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
      }

      registered = true;
    })
    .catch((error) => {
      registrationPromise = null;
      throw error;
    });

  return registrationPromise;
}

export default function MaterialProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    registerMaterialComponents().catch(() => {
      // Keep rendering with fallback styles if registration fails.
    });
  }, []);

  return <>{children}</>;
}
