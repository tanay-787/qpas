
    export default async (req, res) => {
        const { default: app } = await import('../backend/server.js');
        app(req, res); // Call the imported app
      };