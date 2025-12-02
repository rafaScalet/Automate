import { Icon } from '@iconify/react';

interface HelloWorldProps {
  message?: string;
  icon?: string;
}

export function HelloWorld({
  message = 'Hello World!',
  icon = 'ph:play-bold',
}: HelloWorldProps) {
  return (
    <div className="flex flex-row items-center justify-center gap-3 rounded-2xl bg-pink-400 p-2 font-bold text-3xl text-white dark:bg-rose-600 dark:text-zinc-800">
      <Icon icon={icon} />
      <h1>{message}</h1>
      <Icon icon={icon} />
    </div>
  );
}
