import { Layout } from './Layout';
import { LayoutNavbar } from './LayoutNavbar';
import { PageConfigContext } from './PageConfigContext';
import { withPageConfig } from './withPageConfig';
import { LayoutContent } from './LayoutContent';
import { setupPage } from './setupPage';

Layout.Navbar = LayoutNavbar;
Layout.Content = LayoutContent;

const PageConfigProvider = PageConfigContext.Provider;
const PageConfigConsumer = PageConfigContext.Consumer;

export default Layout;
export { withPageConfig, setupPage, PageConfigProvider, PageConfigConsumer };
