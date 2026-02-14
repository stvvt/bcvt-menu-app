import RefDate from '@/components/RefDate';
import { Fragment, type FC, type PropsWithChildren } from 'react';

const MenuLayout: FC<PropsWithChildren> = async ({ children }) => {
  return (
    <div className="max-w-3xl mx-auto w-full">
      <h1 className="text-2xl font-bold text-center">
        <RefDate />
      </h1>

      <Fragment key="content">
        {children}
      </Fragment>
    </div>
  );
};

export default MenuLayout;
