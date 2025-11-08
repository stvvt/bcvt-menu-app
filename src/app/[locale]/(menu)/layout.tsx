import RefDate from '@/components/RefDate';
// No UI imports needed - using Tailwind classes
import { Fragment, type FC, type PropsWithChildren } from 'react';

const MenuLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <h1 className="text-2xl font-bold text-center">
        <span className="flex items-center justify-center gap-2">
          <span className="text-muted-foreground">BCVT Menu{' '}</span>
          <RefDate />
        </span>
      </h1>

      <Fragment key="content">
        {children}
      </Fragment>
    </>
  );
}

export default MenuLayout;
