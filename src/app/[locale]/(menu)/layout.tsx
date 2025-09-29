import RefDate from '@/components/RefDate';
import { Heading, HStack, Text } from "@chakra-ui/react";
import { Fragment, type FC, type PropsWithChildren } from 'react';

const MenuLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Heading size="lg">
        <HStack as="span">
          <Text color="gray.500" as="span">BCVT Menu{' '}</Text>
          <RefDate />
        </HStack>
      </Heading>

      <Fragment key="content">
        {children}
      </Fragment>
    </>
  );
}

export default MenuLayout;
