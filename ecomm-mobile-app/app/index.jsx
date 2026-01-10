import { Redirect } from 'expo-router';

export default function Index() {
  // Always redirect to articles - no auth check needed
  // Articles page is accessible for everyone (anonymous + authenticated)
  return <Redirect href="/(tabs)/articles" />;
}
