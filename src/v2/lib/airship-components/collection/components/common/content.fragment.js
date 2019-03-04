export default function (isLoading, error, isEmpty, heading, errorDescription, noDataMessage, fragment) {
    if (isLoading) {
        return h("as-loader", { class: heading ? 'content as-pb--36' : 'content as-pb--20' });
    }
    if (error) {
        return h("p", { class: 'content as-body' }, errorDescription || 'Unexpected error');
    }
    if (isEmpty) {
        return h("p", { class: 'content as-body' }, noDataMessage);
    }
    return fragment;
}
