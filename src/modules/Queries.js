
module.exports.ftdCurrentMonth = (start) => {
    return `select count(1)
            from player_badges as pb
            where pb.key = 'first_deposit'
            and pb.when >= '${start}';`
};

module.exports.ftdPastMonth = (start, end) => {
    return `select count(1)
            from player_badges as pb
            where pb.key = 'first_deposit'
            and pb.when >= '${start}'
            and pb.when < '${end}';`
};
