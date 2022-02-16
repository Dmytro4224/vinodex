const classList = (...args: string[]) => {
    return args.join(' ');
};

const transformArtistId = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(7, 11)}`;
};

export {
    classList,
    transformArtistId
};