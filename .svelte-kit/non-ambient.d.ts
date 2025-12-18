
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/buy" | "/buy/[id]" | "/donate" | "/exchange" | "/listing" | "/search" | "/sponsors" | "/sponsor";
		RouteParams(): {
			"/buy/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string };
			"/buy": { id?: string };
			"/buy/[id]": { id: string };
			"/donate": Record<string, never>;
			"/exchange": Record<string, never>;
			"/listing": Record<string, never>;
			"/search": Record<string, never>;
			"/sponsors": Record<string, never>;
			"/sponsor": Record<string, never>
		};
		Pathname(): "/" | "/buy" | "/buy/" | `/buy/${string}` & {} | `/buy/${string}/` & {} | "/donate" | "/donate/" | "/exchange" | "/exchange/" | "/listing" | "/listing/" | "/search" | "/search/" | "/sponsors" | "/sponsors/" | "/sponsor" | "/sponsor/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/donate_books.jpg" | "/exchange.jpg" | "/listing.jpg" | "/logo.ico" | "/logo.jpg" | "/robots.txt" | "/search_books.jpg" | "/vite.svg" | string & {};
	}
}