import {
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { addAction } from './add-action';
import { appRouterUseHash } from './use-hash';

import { applicationGenerator, E2eTestRunner } from '@nrwl/angular/generators';
import { addFiles, NormalizedSchema } from '../../generator';

export const angularApp = async (tree: Tree, options: NormalizedSchema) => {
  await applicationGenerator(tree, {
    name: options.name,
    routing: true,
    e2eTestRunner: E2eTestRunner.None,
  });

  const config = readProjectConfiguration(tree, options.name);

  appRouterUseHash(tree, config.root);

  await addAction(tree, options.name);

  const manifestPath = `${config.root}/src/manifest.json`;
  if (config.targets.build.options.assets.includes(manifestPath) != true) {
    config.targets.build.options.assets.push(
      `${config.root}/src/manifest.json`
    );
  }

  config.targets.serve.executor = '@spaceribs/nx-web-ext:serve';

  addFiles(tree, options, config.root);

  updateProjectConfiguration(tree, config.name, config);
};