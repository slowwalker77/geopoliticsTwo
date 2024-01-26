import React, { Fragment } from 'react';
import Link from 'next/link';
import { Disclosure } from '@headlessui/react';
import classNames from '@/services/classNames';

export default function Navbar({ navigation, selected, onClick, disclosure }) {
  return (
    <Fragment>
      {!disclosure &&
        navigation.map((item) => (
          <Link
            key={item.name}
            href={`/blogs/${item.tag}`}
            className={classNames(
              item.name === selected
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'rounded-md px-3 py-2 text-sm font-medium'
            )}
            aria-current={item.current ? 'page' : undefined}
            onClick={() => onClick(item.name)}
          >
            {item.name}
          </Link>
        ))}
      {disclosure &&
        navigation.map((item) => (
          <Disclosure.Button
            key={item.name}
            as='a'
            href={`/blogs/${item.tag}`}
            className={classNames(
              item.current
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white focus:bg-black',
              'block rounded-md px-3 py-2 text-base font-medium'
            )}
            aria-current={item.current ? 'page' : undefined}
          >
            {item.name}
          </Disclosure.Button>
        ))}
    </Fragment>
  );
}
