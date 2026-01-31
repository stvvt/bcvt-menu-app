import RefDate from '@/components/RefDate';
import { getVenueOrThrow } from '@/config/venues';
import { Fragment, type FC, type PropsWithChildren } from 'react';

type Props = {
  params: Promise<{ venue: string }>;
};

const MenuLayout: FC<PropsWithChildren<Props>> = async ({ children, params }) => {
  const { venue } = await params;
  const venueConfig = getVenueOrThrow(venue);

  return (
    <>
      <h1 className="text-2xl font-bold text-center">
        <span className="flex items-center justify-center gap-2">
          <span className="text-muted-foreground">{venueConfig.name}{' '}</span>
          <RefDate />
        </span>
      </h1>

      <Fragment key="content">
        {children}
      </Fragment>
    </>
  );
};

export default MenuLayout;
