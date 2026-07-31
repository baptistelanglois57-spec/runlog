export const MOBILE_BREAKPOINT = 768;

export function isMobile() {
  return window.innerWidth <= MOBILE_BREAKPOINT;
}

export function value<T>(
  mobile: T,
  desktop: T
) {
  return isMobile() ? mobile : desktop;
}