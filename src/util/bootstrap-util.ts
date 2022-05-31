export class ArrayPositionType {
    static readonly FIRST = "First";
    static readonly MIDDLE = "Middle";
    static readonly LAST = "Last";
    static readonly getArrayPositionType = (len:number, index:number) => {
        if (index === 0) {
            return ArrayPositionType.FIRST;
        } else if (index === len - 1) {
            return ArrayPositionType.LAST;
        } else {
            return ArrayPositionType.MIDDLE;
        }
    }
};