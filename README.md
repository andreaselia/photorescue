# PhotoRescue

A simple image transformation application utilising Vercel for hosting, Upstash for Redis, and Replicate for the image manipulation model.

## Prerequisites

This project relies on Vercel, Upstash and Replicate.

- [Vercel](https://vercel.com)
- [Upstash](https://upstash.com?utm_source=andreas1)
- [Replicate](https://replicate.com)

## Installation

To get started with the project, follow these steps:

1. Clone the repository to your local machine:

```bash
git clone https://github.com/andreaselia/photorescue.git
```

2. Navigate to the project directory:

```bash
cd photorescue
```

3. Install the dependencies:

```bash
npm install
# or
yarn install
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

You'll need to deploy the project to Vercel, or serve it locally, so that the callback URL can be accessible for the request to Replicate.

## Further Reading

- [Next.js documentation](https://nextjs.org/docs/getting-started)
- [React documentation](https://reactjs.org/docs/getting-started.html)
- [Upstash documentation](https://docs.upstash.com/redis?utm_source=andreas1)

## Contributing

To contribute to the project, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature.
3. Commit your changes and push the branch to your fork.
4. Create a new pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
