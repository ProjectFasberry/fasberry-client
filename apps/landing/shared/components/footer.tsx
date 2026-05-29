import { Link } from '@/shared/components/link';
import { getStaticObject } from '@/shared/lib/helpers';
import { For } from 'solid-js';

const FOOTER_LINKS = [
  { name: 'Конфиденциальность', href: 'privacy' },
  { name: 'Соглашение', href: 'terms' },
  { name: 'Контакты', href: 'contacts' },
  { name: 'Благодарности', href: 'credits' },
];

const bedrockImage = getStaticObject("minecraft", "static/bedrock.webp")

export const Footer = () => {
  return (
    <footer
      class={`sticky flex-col flex justify-center items-center gap-6 pb-6 pt-12`}
      style={{ "background-size": '160px', "background-image": `url(${bedrockImage})` }}
    >
      <div class="flex flex-col justify-center items-center lg:flex-row responsive gap-2 mx-auto">
        <For each={FOOTER_LINKS}>
          {(item, idx) => (
            <>
              <Link href={`/info/${item.href}`}>
                <p>{item.name}</p>
              </Link>
              {idx() < FOOTER_LINKS.length - 1 &&
                <span class="text-neutral-400 hidden lg:block mx-2">&</span>
              }
            </>
          )}
        </For>
      </div>
      <div class="flex flex-col items-center justify-center gap-2 responsive mx-auto">
        <p class="text-center">
          Fasberry Project. Оригинальные права принадлежат Mojang AB.
        </p>
      </div>
    </footer>
  );
};
