import WPAPI from "wpapi"

export const wpClient = new WPAPI({
    endpoint: `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json`,
});

export default wpClient