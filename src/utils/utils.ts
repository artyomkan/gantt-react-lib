export const wait = (params?: {
    milliseconds?: number;
    func?: VoidFunction;
}) => {
    return new Promise((resolve) =>
        setTimeout(
            () => {
                params?.func?.();

                resolve(undefined);
            },
            params?.milliseconds ?? 0
        )
    );
}