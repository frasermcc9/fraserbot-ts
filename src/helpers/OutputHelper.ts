export default abstract class OutputHelper {
    public static makeAlphabetical(list: string[]) {
        return list.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    }

    public static chunkSplit(list: string[], chunks: number) {
        let result = [];
        for (let i = chunks; i > 0; i--) {
            result.push(list.splice(0, Math.ceil(list.length / i)));
        }
        return result;
    }

    public static delimit(x: number | string) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

	public static tab() {
		return "⠀⠀";
	}
}
