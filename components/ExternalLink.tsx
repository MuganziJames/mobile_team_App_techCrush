import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { ComponentProps } from 'react';
import { GestureResponderEvent, Platform } from 'react-native';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string };

/**
 * A component that opens a web link in a browser or in-app browser.
 */
export function ExternalLink(props: Props) {
  const { href, ...otherProps } = props;

  return (
    <Link
      target="_blank"
      {...otherProps}
      href={href}
      onPress={(event: GestureResponderEvent) => {
        if (Platform.OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          WebBrowser.openBrowserAsync(href);
        }
      }}
    />
  );
}
