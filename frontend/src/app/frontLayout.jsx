import React from 'react';
import Link from "next/link";
import ElttlEmblem from "@/components/icons/ElttlEmblem";
import MenuPrimary from "@/components/MenuPrimary";

export default async function FrontLayout({children}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const auth = {user: null};
  const appName = 'East Lancashire Table Tennis League';
  const response = await fetch(`${apiUrl}/frontend`);
  const data = await response.json();
  const headLinks = data.headLinks;
  const menuPrimary = data.menuPrimary;
  const footLinks = data.footLinks;

  return (
    <div className={'flex justify-center'}>
      <div className={'max-w-[1920px]'}>
        <div className="flex border-b text-sm">
          <ul className="flex-1">
            {headLinks.map((item) => (
              <Link className={"p-2 inline-block"} key={item.name}
                    href={item.url}>{item.name}</Link>
            ))}
          </ul>
          <div className={"flex"}>
            {auth.user ? (
              <Link
                className={"p-2"}
                href="/account/"
              >
                My Account
              </Link>
            ) : (
              <>
                <Link
                  className={"p-2"}
                  href="/login/"
                >
                  Log in
                </Link>
                <Link
                  className={"p-2"}
                  href="/register/"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        <header className={'sm:flex border-b bg-white drop-shadow-lg'}>
          <Link href={'/'}
                className={'flex-1 flex gap-2 sm:gap-4 p-4 items-center justify-center sm:justify-start border-b max-w-[500px]'}>
            <ElttlEmblem className={'sm:hidden'} width={'50px'}/>
            <ElttlEmblem className={'hidden sm:block'} width={'75px'}/>
            <span className={''}>
                        <span className={'hidden sm:block text-4xl'}>{appName}</span>
                        <span className={'sm:hidden text-5xl font-bold'}>ELTTL</span>
                    </span>
          </Link>
          <MenuPrimary items={menuPrimary}/>
        </header>

        <div className={''}>
          {children}
        </div>

        <footer className={'md:flex bg-gray-500'}>
          <div className={'basis-1/4 p-4'}>
            <Link href={''}>&copy; {appName}</Link>
            Hyndburn Sports Centre
            Henry Street
            Church
            Accrington
            Telephone: 01254 385945
          </div>
          <div className={'basis-1/4 p-4'}>
            <nav className={'bg-gray-600 rounded'}>
              {footLinks.filter((item) => item.area === 1).map((item) => (
                <Link className={"block p-2 hover:bg-gray-500"} key={item.name}
                      href={item.url}>{item.name}</Link>
              ))}
            </nav>
          </div>
          <div className={'basis-1/4 p-4'}>
            <nav className={'bg-gray-600 rounded'}>
              {footLinks.filter((item) => item.area === 2).map((item) => (
                <Link className={"block p-2 hover:bg-gray-500"} key={item.name}
                      href={item.url}>{item.name}</Link>
              ))}
            </nav>
          </div>
          <div className={'basis-1/4'}>
            <Link href={''}>Twitter</Link>
            <Link href={''}>Facebook</Link>
            <Link href={''}>Table Tennis England</Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
