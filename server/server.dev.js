import path from 'path';
import chokidar from 'chokidar';
import hotClient from 'webpack-hot-client';
import devMiddleware from 'webpack-dev-middleware';
import webpack from 'webpack';
import DashboardPlugin from 'webpack-dashboard/plugin';
import config from '../webpack/base.client';
import { manifestFilename } from '@config';

/* This module sets up the development environment for our server.
 * This is and should only be loaded in development ONLY:
 *
 * - Attaches webpack-hot-client and webpack-dev-middleware to express for
 * hot reloading on the client.
 * - Adds webpack-dashboard plugin.
 * - Adds require.cache invalidation for server HMR.
 */

const startCacheInvalidator = function() {
  const cwd = process.cwd();
  const watcher = chokidar.watch([
    path.join(cwd, 'client', '**/*'),
    path.join(cwd, 'common', '**/*'),
    path.join(cwd, 'config', '**/*'),
    path.join(cwd, 'server', '**/*')
  ], { persistent: true });

  watcher.on('ready', () => {
    const watchFiles = watcher.getWatched();

    watcher.on('all', (event, file) => {
      if (event === 'change') {
        console.log('File changed, clearing cache:', file);

        // Invalidate manifest
        const output = process.env.PUBLIC_OUTPUT_PATH || 'dist/public';
        const manifestPath = path.join(cwd, output, manifestFilename);
        delete require.cache[manifestPath];

        // Invalidate watched files
        Object.keys(watchFiles).forEach(dir => {
          watchFiles[dir].forEach(file => {
            delete require.cache[`${dir}/${file}`];
          });
        });
      }
    });
  });
};

module.exports = app => {
  const compiler = webpack(config);
  const dashboardPlugin = new DashboardPlugin();

  // Add a custom require.cache invalidator to "hot-reload" our server
  // components
  startCacheInvalidator();

  // Add webpack-dashboard plugin
  compiler.apply(dashboardPlugin);

  // Set up hot reloading with WebSockets
  const client = hotClient(compiler, {
    allEntries: true
  });

  // Add dev middleware to our express app once hot client is up
  client.server.on('listening', () => {
    const middleware = devMiddleware(compiler, {
      publicPath: config.output.publicPath,
      writeToDisk: true,
      stats: { color: true, children: false }
    });

    return app.use(middleware);
  });
};
