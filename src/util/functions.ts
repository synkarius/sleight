export const getOrThrow = <T,>(fns:(()=> T|undefined)[], err:()=>Error):T => {
    for (let index = 0; index < fns.length; index++) {
        const result = fns[index]();
        if (result) {
            return result;
        }
    }
    throw err();
}

export const getRandomId = () => crypto.randomUUID();