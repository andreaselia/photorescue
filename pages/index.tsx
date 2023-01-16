import Head from 'next/head'
import { RefObject, useRef, useState, MouseEvent } from 'react'
import useInterval from '../hooks/useInterval'

export default function Home() {
  const [restoring, setRestoring] = useState<boolean>(false)
  const [messageId, setMessageId] = useState<string|null>(null)
  const [prediction, setPrediction] = useState<any>({})
  const [outputImageUrl, setOutputImageUrl] = useState<string|null>(null)
  const imageUrlRef: RefObject<HTMLInputElement> = useRef(null)
  const hrRef: RefObject<HTMLInputElement> = useRef(null)
  const scratchRef: RefObject<HTMLInputElement> = useRef(null)

  useInterval(async () => {
    await fetch(`/api/poll?id=${messageId}`)
      .then((res: any) => res.json())
      .then((data: any) => {
        if (!data.output) {
          return
        }

        setRestoring(false)
        setMessageId(null)
        setOutputImageUrl(data.output)
      })
      .catch((err: any) => console.error(err))
  }, messageId ? 1000 : null)

  async function restoreImage(e: any) {
    e.preventDefault()

    setRestoring(true)

    await fetch('/api/create', {
      method: 'POST',
      body: JSON.stringify({
        image_url: imageUrlRef.current?.value,
        is_hr: hrRef.current?.value,
        has_scratches: scratchRef.current?.value,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res: Response) => res.json())
      .then((data: any) => {
        setMessageId(data.data.id)
        setPrediction(data.data)
      })
      .catch((err: Error) => console.error(err))
  }

  async function cancel(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    await fetch('/api/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cancel_url: prediction.urls.cancel })
    })
      .then((res: Response) => res.json())
      .then((data: any) => {
        setMessageId(null)
        setPrediction({})
        setRestoring(false)
      })
      .catch((err: Error) => console.error(err))
  }

  return (
    <>
      <Head>
        <title>PhotoRescue</title>
        <meta name="description" content="A simple Next.js application that utilizes Replicate to restore old photos." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="my-16 flex flex-col justify-center items-center md:my-32">
          <h1 className="text-5xl font-black">
            PhotoRescue
          </h1>

          <p className="mt-4">Restore your old photos to their former glory.</p>
         

          {outputImageUrl && (
            <div className="flex flex-col items-center justify-center">
              <img src={outputImageUrl} alt="Restored Image" className="mt-8 w-72 h-auto" />

              <button
                type="button"
                onClick={() => setOutputImageUrl(null)}
                className="mt-8 inline-flex items-center rounded-full border border-transparent bg-gray-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 disabled:opacity-50"
              >
                Start Again
              </button>
            </div>
          )}

          {!outputImageUrl && (
            <form onSubmit={restoreImage} className="mt-10 flex flex-col items-center w-full max-w-lg">
              <div className="w-full space-y-4">
                <div>
                  <label htmlFor="image_url" className="text-sm font-semibold">
                    Image URL
                  </label>
                  <input
                    name="image_url"
                    id="image_url"
                    type="text"
                    defaultValue="https://replicate.delivery/mgxm/b033ff07-1d2e-4768-a137-6c16b5ed4bed/d_1.png"
                    placeholder="https://example.com/image.png"
                    className="mt-0.5 p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                    ref={imageUrlRef}
                    required
                  />
                </div>
                <div className="max-w-lg space-y-4">
                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        name="is_hr"
                        id="is_hr"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                        ref={hrRef}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="is_hr" className="font-medium text-gray-900">Is High Resolution?</label>
                      <p className="text-gray-500">Check this if the input image is a high resolution photo.</p>
                    </div>
                  </div>
                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        name="is_scratched"
                        id="is_scratched"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                        ref={scratchRef}
                        defaultChecked={true}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="is_scratched" className="font-medium text-gray-900">Has Scratches?</label>
                      <p className="text-gray-500">Check this if the input image has visible scratches over it.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex gap-2">
                <button
                  type="submit"
                  disabled={restoring}
                  className="inline-flex items-center rounded-full border border-transparent bg-gray-900 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 disabled:opacity-50"
                >
                  {restoring ? 'Restoring...' : 'Restore'}
                </button>

                {restoring && prediction && (
                  <button
                    type="button"
                    onClick={cancel}
                    className="inline-flex items-center rounded-full border border-gray-900 bg-white px-6 py-2.5 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  )
}
