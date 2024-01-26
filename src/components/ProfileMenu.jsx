import { Menu } from '@headlessui/react';
import classNames from '@/services/classNames';

export default function ProfileMenu({ profileMenu: { name, href } }) {
  return (
    <Menu.Item>
      {({ active }) => (
        <a
          href={href}
          className={classNames(
            active ? 'bg-gray-100' : '',
            'block px-4 py-2 text-sm text-gray-700'
          )}
        >
          {name}
        </a>
      )}
    </Menu.Item>
  );
}
