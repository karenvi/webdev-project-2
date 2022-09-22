import { useEffect, useState } from "react";

interface Props {
    accessToken: string;
    projectId: string;
}

function Connect({ accessToken, projectId }: Props) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [resultData, setResult] = useState<any[]>([])

    const gitlabRepoLink = "https://gitlab.stud.idi.ntnu.no/api/v4/projects/" + projectId + "/repository/commits"
    
    // based on the example in React's Ajax documentation https://reactjs.org/docs/faq-ajax.html
    useEffect(() => {
        fetch(gitlabRepoLink,
            {
                method: 'GET',
                headers: {
                    'PRIVATE-TOKEN': accessToken
                }

            })
            .then(res => res.json())
            .then(
                (result) => {
                    setIsLoaded(true);
                    (!Array.isArray(result)) ? setResult([result]) : setResult(result);
                    //setResult(initArray => [...initArray, result]);
                    //console.log(typeof resultData);
                    console.log(result);
                },
                // denne trigges av feil (men ikke tomt) api-kall
                (error) => {
                    setIsLoaded(true);
                    setError(error);
                    console.log(error);
                })
            // dette er ikke bra men siden crasher ikke hvis denne er med
            .catch(() => console.log("Felt for repo er tomt"))
    }, [accessToken, gitlabRepoLink])


    if (error) {
        return <div>Error: {error}</div>;
    }
    else if (!isLoaded) {
        return <div>Loading...</div>;
    }
    else {
        return (<ul style={{ listStyleType: "none" }}>
            {resultData.map((result, i) => (
                <li key={i}>
                    {result.message}
                </li>
            ))}
        </ul>
        );
    }
}
export default Connect;