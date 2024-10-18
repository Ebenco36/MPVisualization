import { useRoute, useRouter } from 'vue-router';

export default (() => {
const __VLS_setup = async () => {
const route = useRoute();
const router = useRouter();

// onMounted(() => {
//   // const route = useRoute()
//   // console.log(route.path)
// }),
// console.log(router.currentRoute.value)
computed;

defineProps({
label: String,
routeName: String,
subRoute: String
});
const __VLS_publicComponent = (await import('vue')).defineComponent({
setup() {
return {
$props: (await import('./__VLS_types.js')).makeOptional(defineProps({
label: String,
routeName: String,
subRoute: String
})),
};
},
});

const __VLS_componentsOption = {};

let __VLS_name!: 'HeaderCrumbs';
function __VLS_template() {
let __VLS_ctx!: InstanceType<import('./__VLS_types.js').PickNotAny<typeof __VLS_publicComponent, new () => {}>> & InstanceType<import('./__VLS_types.js').PickNotAny<typeof __VLS_internalComponent, new () => {}>> & {};
/* Components */
let __VLS_localComponents!: NonNullable<typeof __VLS_internalComponent extends { components: infer C; } ? C : {}> & typeof __VLS_componentsOption & typeof __VLS_ctx;
let __VLS_otherComponents!: typeof __VLS_localComponents & import('./__VLS_types.js').GlobalComponents;
let __VLS_own!: import('./__VLS_types.js').SelfComponent<typeof __VLS_name, typeof __VLS_internalComponent & typeof __VLS_publicComponent & (new () => { $slots: typeof __VLS_slots; }) >;
let __VLS_components!: typeof __VLS_otherComponents & Omit<typeof __VLS_own, keyof typeof __VLS_otherComponents>;
/* Style Scoped */
type __VLS_StyleScopedClasses = {};
let __VLS_styleScopedClasses!: __VLS_StyleScopedClasses | keyof __VLS_StyleScopedClasses | (keyof __VLS_StyleScopedClasses)[];
/* CSS variable injection */
/* CSS variable injection end */
let __VLS_templateComponents!: {};
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("breadcrumb"), };
{
({} as JSX.IntrinsicElements).h1;
({} as JSX.IntrinsicElements).h1;
(__VLS_x as JSX.IntrinsicElements)['h1'] = { class: ("mr-2"), };
(__VLS_ctx.route.name);
// @ts-ignore
[route,];
}
{
({} as JSX.IntrinsicElements).ul;
({} as JSX.IntrinsicElements).ul;
(__VLS_x as JSX.IntrinsicElements)['ul'] = {};
{
({} as JSX.IntrinsicElements).li;
({} as JSX.IntrinsicElements).li;
(__VLS_x as JSX.IntrinsicElements)['li'] = {};
{
({} as JSX.IntrinsicElements).a;
({} as JSX.IntrinsicElements).a;
(__VLS_x as JSX.IntrinsicElements)['a'] = { href: (""), };
}
}
{
({} as JSX.IntrinsicElements).li;
({} as JSX.IntrinsicElements).li;
(__VLS_x as JSX.IntrinsicElements)['li'] = {};
}
}
}
{
({} as JSX.IntrinsicElements).div;
({} as JSX.IntrinsicElements).div;
(__VLS_x as JSX.IntrinsicElements)['div'] = { class: ("separator-breadcrumb border-top"), };
}
if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
}
declare var __VLS_slots: {};
return __VLS_slots;
}
const __VLS_internalComponent = (await import('vue')).defineComponent({
setup() {
return {
...defineProps({
label: String,
routeName: String,
subRoute: String
}),
route: route,
};
},
});
return {} as typeof __VLS_publicComponent;
};
return {} as typeof __VLS_setup extends () => Promise<infer T> ? T : never;
})({} as any);
