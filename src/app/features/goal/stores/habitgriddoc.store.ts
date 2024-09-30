import { computed, inject } from '@angular/core';
import { concatMap, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import {
    patchState,
    signalStore,
    withComputed,
    withMethods,
    withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { HabitGridService } from '../services/habitgrid.service';
import { HabitGriddoc } from '../models/habitgriddoc';
import { HabitGrid } from '../models/habitgrid';

type HabitGridState = {
    id: number,
    habitprogress: HabitGrid;
    habitgrid: Array<HabitGrid>;
    habitgriddoc: Array<HabitGriddoc>;
    habitMatrix: Array<any>,
    isLoading: boolean;
};

const initialState: HabitGridState = {
    id: 0,
    habitprogress: new HabitGrid(),
    habitgrid: new Array<HabitGrid>(),
    habitgriddoc: new Array<HabitGriddoc>(),
    habitMatrix: new Array<any>(),
    isLoading: false,
};

export const HabitGriddocStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed(({ habitgrid }) => ({
        habitgridsCount: computed(() => habitgrid().length),
        habitgridsList: computed(() => habitgrid())
    })),
    withMethods((store, habitgridService = inject(HabitGridService)) => ({
        setHabitGriddocId(habitgridid: number): void {
            patchState(store, { id: habitgridid });
        },

        // getHabitGridByDate: rxMethod<string>(
        //     pipe(
        //         distinctUntilChanged(),
        //         tap(() => patchState(store, { isLoading: true })),
        //         concatMap((date) => {
        //             return habitgridService.getHabitGridByDate(date).pipe(
        //                 tapResponse({
        //                     next: (habitprogress: HabitGrid) => {
        //                         patchState(store, { habitprogress })
        //                     },
        //                     error: console.error,
        //                     finalize: () => patchState(store, { isLoading: false }),
        //                 })
        //             );
        //         })
        //     )
        // ),
        getHabitGriddoc: rxMethod<void>(
            pipe(
                distinctUntilChanged(),
                tap(() => patchState(store, { isLoading: true })),
                concatMap(() => {
                    return habitgridService.getHabitGriddoc().pipe(
                        tapResponse({
                            next: (habitgriddoc: Array<HabitGriddoc>) => {
                                habitgriddoc.sort((a, b) => new Date(a.habitGrid?.date!).setHours(0, 0, 0, 0) - new Date(b.habitGrid?.date!).setHours(0, 0, 0, 0))
                                let habitMatrix = habitgridService.buildHabitMatrix(habitgriddoc)
                                // patchState(store, { habitgriddoc })
                                patchState(store, { habitMatrix })
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                })
            )
        ),
        addHabitGriddoc: rxMethod<any>(
            pipe(
                tap(() => patchState(store, { isLoading: true })),
                concatMap((habitgriddoc: HabitGriddoc) => {
                    return habitgridService.postHabitGriddoc(habitgriddoc).pipe(
                        tapResponse({
                            next: (res: HabitGriddoc) => {
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                }),
                concatMap(() => {
                    return habitgridService.getHabitGriddoc().pipe(
                        tapResponse({
                            next: (habitgriddoc: Array<HabitGriddoc>) => {
                                habitgriddoc.sort((a, b) => new Date(a.habitGrid?.date!).setHours(0, 0, 0, 0) - new Date(b.habitGrid?.date!).setHours(0, 0, 0, 0))
                                let habitMatrix = habitgridService.buildHabitMatrix(habitgriddoc)
                                // patchState(store, { habitgriddoc })
                                patchState(store, { habitMatrix })
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                })
            )
        ),
        saveHabitGriddoc: rxMethod<HabitGriddoc>(
            pipe(
                tap(() => patchState(store, { isLoading: true })),
                concatMap((habitgriddoc: HabitGriddoc) => {
                    return habitgridService.putHabitGriddoc(habitgriddoc).pipe(
                        tapResponse({
                            next: (res: HabitGriddoc) => {
                                let habitMatrix = habitgridService.buildHabitMatrix(store.habitgriddoc())
                                patchState(store, { habitMatrix })
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                }),
                concatMap(() => {
                    return habitgridService.getHabitGriddoc().pipe(
                        tapResponse({
                            next: (habitgriddoc: Array<HabitGriddoc>) => {
                                habitgriddoc.sort((a, b) => new Date(a.habitGrid?.date!).setHours(0, 0, 0, 0) - new Date(b.habitGrid?.date!).setHours(0, 0, 0, 0))
                                let habitMatrix = habitgridService.buildHabitMatrix(habitgriddoc)
                                // patchState(store, { habitgriddoc })
                                patchState(store, { habitMatrix })
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                })
            )
        ),
        deleteHabitGriddoc: rxMethod<number>(
            pipe(
                tap(() => patchState(store, { isLoading: true })),
                concatMap((id) => {
                    return habitgridService.deleteHabitGriddoc(id).pipe(
                        tapResponse({
                            next: (res: any) => {
                                // remove deleted from store
                                patchState(store, (state: any) => ({ habitgriddoc: state.habitgriddoc.filter((habitgriddoc: HabitGriddoc) => habitgriddoc.id !== id) }))
                            },
                            error: console.error,
                            finalize: () => patchState(store, { isLoading: false }),
                        })
                    );
                })
            )
        )
    }))
);