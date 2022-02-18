const classList = (...args: string[]) => {
    return args.join(' ');
};

const transformArtistId = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(hash.length - 4)}`;
};

export {
    classList,
    transformArtistId
};