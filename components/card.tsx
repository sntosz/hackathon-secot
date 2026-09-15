export default function Card(props : { name: string; subtitle: string; hours:number }) {
    return(
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <p className="text-lg font-semibold text-blue-500 dark:text-blue-400 mt-4">
                Hours: {props.hours}
            </p>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{props.name}</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
                {props.subtitle}
            </p>
        </div>
    )
}
