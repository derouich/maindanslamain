import { Youtube, Instagram, Facebook } from "lucide-react"

export default function SocialLinks() {
  return (
    <div className="py-16 bg-gray-50">
      <div className="container px-4 mx-auto text-center">
        <h2 className="mb-8 text-3xl font-bold text-gray-800">Suivez Dr. Youness Chraibi</h2>

        <div className="flex flex-wrap justify-center gap-8">
          <a
            href="https://www.youtube.com/@youneschraibiofficiel"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md transition-transform hover:scale-105"
          >
            <Youtube size={48} className="mb-3 text-red-600" />
            <span className="text-lg font-medium">YouTube</span>
            <span className="text-sm text-gray-500">@youneschraibiofficiel</span>
          </a>

          <a
            href="https://www.instagram.com/drchraibi.main.ds.la.main"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md transition-transform hover:scale-105"
          >
            <Instagram size={48} className="mb-3 text-pink-600" />
            <span className="text-lg font-medium">Instagram</span>
            <span className="text-sm text-gray-500">@drchraibi.main.ds.la.main</span>
          </a>

          <a
            href="https://www.facebook.com/profile.php?id=100087081736330"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md transition-transform hover:scale-105"
          >
            <Facebook size={48} className="mb-3 text-blue-600" />
            <span className="text-lg font-medium">Facebook</span>
            <span className="text-sm text-gray-500">Dr. Youness Chraibi</span>
          </a>
        </div>
      </div>
    </div>
  )
}

