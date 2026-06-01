def build_up(loop, interval): 
    print(loop);
    if loop == 101:
        return build_up(0, interval);
    else: 
        loop += interval
        return build_up(loop, interval);

build_up(0, 1);
